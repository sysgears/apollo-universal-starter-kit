/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';
import withAuth from 'graphql-auth';

import access from './access';
import auth from './auth';
import FieldError from '../../../../common/FieldError';
import settings from '../../../../../settings';

export default pubsub => ({
  Query: {
    users: withAuth(['user:view:all'], (obj, { orderBy, filter }, context) => {
      return context.User.getUsers(orderBy, filter);
    }),
    user: withAuth(
      (obj, args, context) => {
        return context.user.id !== args.id ? ['user:view'] : ['user:view:self'];
      },
      (obj, { id }, context) => {
        return context.User.getUser(id);
      }
    ),
    currentUser(obj, args, context) {
      if (context.user) {
        return context.User.getUser(context.user.id);
      } else {
        return null;
      }
    }
  },
  Mutation: {
    logout(obj, args, context) {
      return access.revoke(context.req);
    },
    addUser: withAuth(
      (obj, args, context) => {
        return context.user.id !== args.id ? ['user:create'] : ['user:create:self'];
      },
      async (obj, { input }, context) => {
        try {
          const e = new FieldError();

          const userExists = await context.User.getUserByUsername(input.username);
          if (userExists) {
            e.setError('username', 'Username already exists.');
          }

          const emailExists = await context.User.getUserByEmail(input.email);
          if (emailExists) {
            e.setError('email', 'E-mail already exists.');
          }

          if (input.password.length < 5) {
            e.setError('password', `Password must be 5 characters or more.`);
          }

          e.throwIf();

          const [createdUserId] = await context.User.register({ ...input });
          await context.User.editUserProfile({ id: createdUserId, ...input });

          if (settings.user.auth.certificate.enabled) {
            await context.User.editAuthCertificate({ id: createdUserId, ...input });
          }

          const user = await context.User.getUser(createdUserId);

          if (context.mailer && settings.user.auth.password.sendAddNewUserEmail && !emailExists && context.req) {
            // async email
            jwt.sign({ user: pick(user, 'id') }, context.SECRET, { expiresIn: '1d' }, (err, emailToken) => {
              const encodedToken = Buffer.from(emailToken).toString('base64');
              const url = `${__WEBSITE_URL__}/confirmation/${encodedToken}`;
              context.mailer.sendMail({
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

          return { user };
        } catch (e) {
          return { errors: e };
        }
      }
    ),
    editUser: withAuth(
      (obj, args, context) => {
        return context.user.id !== args.id ? ['user:update'] : ['user:update:self'];
      },
      async (obj, { input }, context) => {
        try {
          const e = new FieldError();
          const userExists = await context.User.getUserByUsername(input.username);
          if (userExists && userExists.id !== input.id) {
            e.setError('username', 'Username already exists.');
          }

          const emailExists = await context.User.getUserByEmail(input.email);
          if (emailExists && emailExists.id !== input.id) {
            e.setError('email', 'E-mail already exists.');
          }

          if (input.password && input.password.length < 5) {
            e.setError('password', `Password must be 5 characters or more.`);
          }

          e.throwIf();

          await context.User.editUser(input);
          await context.User.editUserProfile(input);

          if (settings.user.auth.certificate.enabled) {
            await context.User.editAuthCertificate(input);
          }

          const user = await context.User.getUser(input.id);

          return { user };
        } catch (e) {
          return { errors: e };
        }
      }
    ),
    deleteUser: withAuth(
      (obj, args, context) => {
        return context.user.id !== args.id ? ['user:delete'] : ['user:delete:self'];
      },
      async (obj, { id }, context) => {
        try {
          const e = new FieldError();
          const user = await context.User.getUser(id);
          if (!user) {
            e.setError('delete', 'User does not exist.');
            e.throwIf();
          }

          if (user.id === context.user.id) {
            e.setError('delete', 'You can not delete your self.');
            e.throwIf();
          }

          const isDeleted = await context.User.deleteUser(id);
          if (isDeleted) {
            return { user };
          } else {
            e.setError('delete', 'Could not delete user. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { errors: e };
        }
      }
    )
  },
  Subscription: {}
});
