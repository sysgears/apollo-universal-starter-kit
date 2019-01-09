/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';
import withAuth from 'graphql-auth';
import { withFilter } from 'graphql-subscriptions';
import { FieldError } from '@module/validation-common-react';

import settings from '../../../settings';

const USERS_SUBSCRIPTION = 'users_subscription';

export default pubsub => ({
  Query: {
    users: withAuth(['user:view:all'], (obj, { orderBy, filter }, { User }) => {
      return User.getUsers(orderBy, filter);
    }),
    user: withAuth(
      () => {
        return ['user:view:self'];
      },
      (obj, { id }, { user, User, req: { t } }) => {
        if (user.id === id || user.role === 'admin') {
          try {
            return { user: User.getUser(id) };
          } catch (e) {
            return { errors: e };
          }
        }

        const e = new FieldError();
        e.setError('user', t('user:accessDenied'));
        return { user: null, errors: e.getErrors() };
      }
    ),
    currentUser(obj, args, { User, user }) {
      if (user) {
        return User.getUser(user.id);
      } else {
        return null;
      }
    }
  },
  User: {
    profile(obj) {
      return obj;
    },
    auth(obj) {
      return obj;
    }
  },
  UserProfile: {
    firstName(obj) {
      return obj.firstName;
    },
    lastName(obj) {
      return obj.lastName;
    },
    fullName(obj) {
      if (obj.firstName && obj.lastName) {
        return `${obj.firstName} ${obj.lastName}`;
      } else {
        return null;
      }
    }
  },
  Mutation: {
    addUser: withAuth(
      (obj, args, { User, user }) => {
        return user.id !== args.input.id ? ['user:create'] : ['user:create:self'];
      },
      async (obj, { input }, { User, user, req: { universalCookies }, mailer, req, req: { t } }) => {
        try {
          const e = new FieldError();

          const userExists = await User.getUserByUsername(input.username);
          if (userExists) {
            e.setError('username', t('user:usernameIsExisted'));
          }

          const emailExists = await User.getUserByEmail(input.email);
          if (emailExists) {
            e.setError('email', t('user:emailIsExisted'));
          }

          if (input.password.length < settings.user.auth.password.minLength) {
            e.setError('password', t('user:passwordLength', { length: settings.user.auth.password.minLength }));
          }

          e.throwIf();

          const [createdUserId] = await User.register({ ...input });
          await User.editUserProfile({ id: createdUserId, ...input });

          if (settings.user.auth.certificate.enabled) {
            await User.editAuthCertificate({ id: createdUserId, ...input });
          }

          const user = await User.getUser(createdUserId);

          if (mailer && settings.user.auth.password.sendAddNewUserEmail && !emailExists && req) {
            // async email
            jwt.sign({ user: pick(user, 'id') }, settings.user.secret, { expiresIn: '1d' }, (err, emailToken) => {
              const encodedToken = Buffer.from(emailToken).toString('base64');
              const url = `${__WEBSITE_URL__}/confirmation/${encodedToken}`;
              mailer.sendMail({
                from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'Your account has been created',
                html: `<p>Hi, ${user.username}!</p>
                <p>Welcome to ${settings.app.name}. Please click the following link to confirm your email:</p>
                <p><a href="${url}">${url}</a></p>
                <p>Below are your login information</p>
                <p>Your email is: ${user.email}</p>
                <p>Your password is: ${input.password}</p>`
              });
            });
          }

          pubsub.publish(USERS_SUBSCRIPTION, {
            usersUpdated: {
              mutation: 'CREATED',
              node: user
            }
          });

          return { user };
        } catch (e) {
          return { errors: e };
        }
      }
    ),
    editUser: withAuth(
      (obj, args, { User, user }) => {
        return user.id !== args.input.id ? ['user:update'] : ['user:update:self'];
      },
      async (obj, { input }, { User, user, req: { t } }) => {
        const isAdmin = () => user.role === 'admin';
        const isSelf = () => user.id === input.id;
        try {
          const e = new FieldError();
          const userExists = await User.getUserByUsername(input.username);

          if (userExists && userExists.id !== input.id) {
            e.setError('username', t('user:usernameIsExisted'));
          }

          const emailExists = await User.getUserByEmail(input.email);
          if (emailExists && emailExists.id !== input.id) {
            e.setError('email', t('user:emailIsExisted'));
          }

          if (input.password && input.password.length < settings.user.auth.password.minLength) {
            e.setError('password', t('user:passwordLength', { length: settings.user.auth.password.minLength }));
          }

          e.throwIf();

          const userInfo = !isSelf() && isAdmin() ? input : pick(input, ['id', 'username', 'email', 'password']);

          await User.editUser(userInfo);
          await User.editUserProfile(input);

          if (settings.user.auth.certificate.enabled) {
            await User.editAuthCertificate(input);
          }
          const user = await User.getUser(input.id);
          pubsub.publish(USERS_SUBSCRIPTION, {
            usersUpdated: {
              mutation: 'UPDATED',
              node: user
            }
          });

          return { user };
        } catch (e) {
          return { errors: e };
        }
      }
    ),
    deleteUser: withAuth(
      (obj, args, { User, user }) => {
        return user.id !== args.id ? ['user:delete'] : ['user:delete:self'];
      },
      async (obj, { id }, context) => {
        const {
          User,
          req: { t }
        } = context;
        const isAdmin = () => context.user.role === 'admin';
        const isSelf = () => context.user.id === id;

        try {
          const e = new FieldError();
          const user = await User.getUser(id);

          if (!user) {
            e.setError('delete', t('user:userIsNotExisted'));
            e.throwIf();
          }

          if (isSelf()) {
            e.setError('delete', t('user:userCannotDeleteYourself'));
            e.throwIf();
          }

          const isDeleted = !isSelf() && isAdmin() ? await User.deleteUser(id) : false;

          if (isDeleted) {
            pubsub.publish(USERS_SUBSCRIPTION, {
              usersUpdated: {
                mutation: 'DELETED',
                node: user
              }
            });
            return { user };
          } else {
            e.setError('delete', t('user:userCouldNotDeleted'));
            e.throwIf();
          }
        } catch (e) {
          return { errors: e };
        }
      }
    )
  },
  Subscription: {
    usersUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(USERS_SUBSCRIPTION),
        (payload, variables) => {
          const { mutation, node } = payload.usersUpdated;
          const {
            filter: { isActive, role, searchText }
          } = variables;

          const checkByFilter =
            !!node.isActive === isActive &&
            (!role || role === node.role) &&
            (!searchText ||
              node.username.toUpperCase().includes(searchText.toUpperCase()) ||
              node.email.toUpperCase().includes(searchText.toUpperCase()));

          switch (mutation) {
            case 'DELETED':
              return true;
            case 'CREATED':
              return checkByFilter;
            case 'UPDATED':
              return !checkByFilter;
          }
        }
      )
    }
  }
});
