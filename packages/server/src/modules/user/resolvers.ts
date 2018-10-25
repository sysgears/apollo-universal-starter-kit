/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';
import withAuth from 'graphql-auth';
import { withFilter, PubSub } from 'graphql-subscriptions';

import * as models from '../../../typings/graphql';
import FieldError from '../../../../common/FieldError';
import settings from '../../../../../settings';
import * as sql from './sql';

const USERS_SUBSCRIPTION = 'users_subscription';

interface Context {
  User: sql.User;
  user: any;
  req: any;
  mailer: any;
}

export default (
  pubsub: PubSub
): {
  Query: models.QueryResolvers.Resolvers<Context>;
  User: models.UserResolvers.Resolvers<Context>;
  UserProfile: models.UserProfileResolvers.Resolvers<Context>;
  Mutation: models.MutationResolvers.Resolvers<Context>;
  Subscription: models.SubscriptionResolvers.Resolvers<Context>;
} => ({
  Query: {
    users: withAuth<models.QueryResolvers.UsersResolver>(['user:view:all'], (obj, { orderBy, filter }, { User }) => {
      return User.getUsers(orderBy, filter);
    }),
    user: withAuth<models.QueryResolvers.UserResolver>(
      ['user:view:self'],
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
        return User.getUser(user.id) as any;
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
    addUser: withAuth<models.MutationResolvers.AddUserResolver>(
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

          const createdUser = await User.getUser(createdUserId);

          if (mailer && settings.user.auth.password.sendAddNewUserEmail && !emailExists && req) {
            // async email
            jwt.sign(
              { user: pick(createdUser, 'id') },
              settings.user.secret,
              { expiresIn: '1d' },
              (_err: any, emailToken: string) => {
                const encodedToken = Buffer.from(emailToken).toString('base64');
                const url = `${__WEBSITE_URL__}/confirmation/${encodedToken}`;
                mailer.sendMail({
                  from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
                  to: createdUser.email,
                  subject: 'Your account has been created',
                  html: `<p>Hi, ${createdUser.username}!</p>
                <p>Welcome to ${settings.app.name}. Please click the following link to confirm your email:</p>
                <p><a href="${url}">${url}</a></p>
                <p>Below are your login information</p>
                <p>Your email is: ${createdUser.email}</p>
                <p>Your password is: ${input.password}</p>`
                });
              }
            );
          }

          pubsub.publish(USERS_SUBSCRIPTION, {
            usersUpdated: {
              mutation: 'CREATED',
              node: createdUser
            }
          });

          return { user: createdUser };
        } catch (e) {
          return { errors: e };
        }
      }
    ),
    editUser: withAuth<models.MutationResolvers.EditUserResolver>(
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
          const resolvedUser = await User.getUser(input.id);
          pubsub.publish(USERS_SUBSCRIPTION, {
            usersUpdated: {
              mutation: 'UPDATED',
              node: resolvedUser
            }
          });

          return { user: resolvedUser };
        } catch (e) {
          return { errors: e };
        }
      }
    ),
    deleteUser: withAuth<models.MutationResolvers.DeleteUserResolver>(
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
            default:
              return null;
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
