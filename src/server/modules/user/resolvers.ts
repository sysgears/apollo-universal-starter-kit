/*eslint-disable no-unused-vars*/
import { withAuth } from 'graphql-auth';
import { PubSub } from 'graphql-subscriptions';
import * as jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import { settings } from '../../../../settings';
import { FieldError } from '../../../common/FieldError';
import { refreshTokens, tryLogin } from './auth';

const USERS_SUBSCRIPTION = 'users_subscription';

export interface AuthInput {
  email?: string;
  password?: string;
}

export interface UserParams {
  id?: number;
  newPassword?: string;
  token?: string;
  refreshToken?: string;
  input?: AuthInput;
}

export const createResolvers = (pubsub: PubSub) => ({
  Query: {
    users: withAuth(['user:view:all'], (obj: any, query: any, context: any) => {
      return context.User.getUsers(query.orderBy, query.filter);
    }),
    user: withAuth(
      (obj: any, args: UserParams, context: any) => {
        return context.user.id !== args.id ? ['user:view'] : ['user:view:self'];
      },
      (obj: any, args: UserParams, context: any) => {
        return context.User.getUser(args.id);
      }
    ),
    currentUser: (obj: any, args: any, context: any) => {
      if (context.user) {
        return context.User.getUser(context.user.id);
      } else {
        return null;
      }
    }
  },
  User: {
    profile: (obj: any) => {
      return obj;
    },
    auth: (obj: any) => {
      return obj;
    }
  },
  UserProfile: {
    firstName: (obj: any) => {
      return obj.firstName;
    },
    lastName: (obj: any) => {
      return obj.lastName;
    },
    fullName: (obj: any) => {
      return `${obj.firstName} ${obj.lastName}`;
    }
  },
  UserAuth: {
    certificate: (obj: any) => {
      return obj;
    },
    facebook: (obj: any) => {
      return obj;
    }
  },
  CertificateAuth: {
    serial: (obj: any) => {
      return obj.serial;
    }
  },
  FacebookAuth: {
    fbId: (obj: any) => {
      return obj.fbId;
    },
    displayName: (obj: any) => {
      return obj.displayName;
    }
  },
  Mutation: {
    register: async (obj: any, args: any, context: any) => {
      try {
        const e = new FieldError();

        const userExists = await context.User.getUserByUsername(args.input.username);
        if (userExists) {
          e.setError('username', 'Username already exists.');
        }

        const emailExists = await context.User.getUserByEmail(args.input.email);
        if (emailExists) {
          e.setError('email', 'E-mail already exists.');
        }

        e.throwIf();

        let userId = 0;
        if (!emailExists) {
          let isActive = false;
          if (!settings.user.auth.password.confirm) {
            isActive = true;
          }

          [userId] = await context.User.register({ ...args.input, isActive });

          // if user has previously logged with facebook auth
        } else {
          await context.User.updatePassword(emailExists.userId, args.input.password);
          userId = emailExists.userId;
        }

        const user = await context.User.getUser(userId);

        if (context.mailer && settings.user.auth.password.sendConfirmationEmail && !emailExists && context.req) {
          // async email
          jwt.sign({ user: pick(user, 'id') } as any, context.SECRET, { expiresIn: '1d' }, (err, emailToken) => {
            const encodedToken = Buffer.from(emailToken).toString('base64');
            const url = `${context.req.protocol}://${context.req.get('host')}/confirmation/${encodedToken}`;
            context.mailer.sendMail({
              from: 'Apollo Universal Starter Kit <nxau5pr4uc2jtb6u@ethereal.email>',
              to: user.email,
              subject: 'Confirm Email',
              html: `<p>Hi, ${user.username}!</p>
              <p>Welcome to ${settings.app.name}. Please click the following link to confirm your email:</p>
              <p><a href="${url}">${url}</a></p>
              <p>Below are your login information</p>
              <p>Your email is: ${user.email}</p>
              <p>Your password is: ${args.input.password}</p>`
            });
          });
        }

        return { user };
      } catch (e) {
        return { errors: e };
      }
    },
    login: async (obj: any, args: UserParams, context: any) => {
      try {
        const tokens = await tryLogin(args.input.email, args.input.password, context.User, context.SECRET);
        if (context.req && context.req.universalCookies) {
          context.req.universalCookies.set('x-token', tokens.token, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true
          });
          context.req.universalCookies.set('x-refresh-token', tokens.refreshToken, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true
          });

          context.req.universalCookies.set('r-token', tokens.token, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false
          });
          context.req.universalCookies.set('r-refresh-token', tokens.refreshToken, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false
          });
        }
        return { tokens };
      } catch (e) {
        return { errors: e };
      }
    },
    logout: async (obj: any, args: any, context: any) => {
      if (context.req && context.req.universalCookies) {
        context.req.universalCookies.remove('x-token');
        context.req.universalCookies.remove('x-refresh-token');

        context.req.universalCookies.remove('r-token');
        context.req.universalCookies.remove('r-refresh-token');
      }

      return true;
    },
    refreshTokens: (obj: any, args: any, context: any) => {
      return refreshTokens(args.token, args.refreshToken, context.User, context.SECRET);
    },
    addUser: withAuth(
      (obj: any, args: any, context: any) => {
        return context.user.id !== args.id ? ['user:create'] : ['user:create:self'];
      },
      async (obj: any, args: any, context: any) => {
        try {
          const e = new FieldError();

          const userExists = await context.User.getUserByUsername(args.input.username);
          if (userExists) {
            e.setError('username', 'Username already exists.');
          }

          const emailExists = await context.User.getUserByEmail(args.input.email);
          if (emailExists) {
            e.setError('email', 'E-mail already exists.');
          }

          if (args.input.password.length < 5) {
            e.setError('password', `Password must be 5 characters or more.`);
          }

          e.throwIf();

          const [createdUserId] = await context.User.register({ ...args.input });
          await context.User.editUserProfile({ id: createdUserId, ...args.input });

          if (settings.user.auth.certificate.enabled) {
            await context.User.editAuthCertificate({ id: createdUserId, ...args.input });
          }

          const user = await context.User.getUser(createdUserId);

          if (context.mailer && settings.user.auth.password.sendAddNewUserEmail && !emailExists && context.req) {
            // async email
            jwt.sign({ user: pick(user, 'id') }, context.SECRET, { expiresIn: '1d' }, (err, emailToken) => {
              const encodedToken = Buffer.from(emailToken).toString('base64');
              const url = `${context.req.protocol}://${context.req.get('host')}/confirmation/${encodedToken}`;
              context.mailer.sendMail({
                from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'Your account has been created',
                html: `<p>Hi, ${user.username}!</p>
                <p>Welcome to ${settings.app.name}. Please click the following link to confirm your email:</p>
                <p><a href="${url}">${url}</a></p>
                <p>Below are your login information</p>
                <p>Your email is: ${user.email}</p>
                <p>Your password is: ${args.input.password}</p>`
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
      (obj: any, args: UserParams, context: any) => {
        return context.user.id !== args.id ? ['user:update'] : ['user:update:self'];
      },
      async (obj: any, args: any, context: any) => {
        try {
          const e = new FieldError();
          const userExists = await context.User.getUserByUsername(args.input.username);
          if (userExists && userExists.id !== args.input.id) {
            e.setError('username', 'Username already exists.');
          }

          const emailExists = await context.User.getUserByEmail(args.input.email);
          if (emailExists && emailExists.id !== args.input.id) {
            e.setError('email', 'E-mail already exists.');
          }

          if (args.input.password && args.input.password.length < 5) {
            e.setError('password', `Password must be 5 characters or more.`);
          }

          e.throwIf();

          await context.User.editUser(args.input);
          await context.User.editUserProfile(args.input);

          if (settings.user.auth.certificate.enabled) {
            await context.User.editAuthCertificate(args.input);
          }

          const user = await context.User.getUser(args.input.id);

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
      (obj: any, args: UserParams, context: any) => {
        return context.user.id !== args.id ? ['user:delete'] : ['user:delete:self'];
      },
      async (obj: any, args: UserParams, context: any) => {
        try {
          const e = new FieldError();
          const user = await context.User.getUser(args.id);
          if (!user) {
            e.setError('delete', 'User does not exist.');
            e.throwIf();
          }

          if (user.id === context.user.id) {
            e.setError('delete', 'You can not delete your self.');
            e.throwIf();
          }

          const isDeleted = await context.User.deleteUser(args.id);
          if (isDeleted) {
            pubsub.publish(USERS_SUBSCRIPTION, {
              usersUpdated: {
                mutation: 'DELETED',
                node: user
              }
            });

            return { user };
          } else {
            e.setError('delete', 'Could not delete user. Please try again later.');
            e.throwIf();
          }
        } catch (e) {
          return { errors: e };
        }
      }
    ),
    forgotPassword: async (obj: any, args: UserParams, context: any) => {
      try {
        const localAuth: any = pick(args.input, 'email');
        const user: any = await context.User.getUserByEmail(localAuth.email);

        if (user && context.mailer) {
          // async email
          jwt.sign(
            { email: user.email, password: user.password } as any,
            context.SECRET,
            { expiresIn: '1d' },
            (err, emailToken) => {
              // encoded token since react router does not match dots in params
              const encodedToken = Buffer.from(emailToken).toString('base64');
              const url = `${context.req.protocol}://${context.req.get('host')}/reset-password/${encodedToken}`;
              context.mailer.sendMail({
                from: 'Apollo Universal Starter Kit <nxau5pr4uc2jtb6u@ethereal.email>',
                to: user.email,
                subject: 'Reset Password',
                html: `Please click this link to reset your password: <a href="${url}">${url}</a>`
              });
            }
          );
        }
        return true;
      } catch (e) {
        // always return true so you can't discover users this way
        return true;
      }
    },
    resetPassword: async (obj: any, args: UserParams, context: any) => {
      try {
        const e = new FieldError();
        const reset: any = pick(args.input, ['password', 'passwordConfirmation', 'token']);
        if (reset.password !== reset.passwordConfirmation) {
          e.setError('password', 'Passwords do not match.');
        }

        if (reset.password.length < 5) {
          e.setError('password', `Password must be 5 characters or more.`);
        }
        e.throwIf();

        const token = Buffer.from(reset.token, 'base64').toString();
        const { email, password } = jwt.verify(token, context.SECRET) as any;
        const user = await context.User.getUserByEmail(email);
        if (user.password !== password) {
          e.setError('token', 'Invalid token');
          e.throwIf();
        }

        if (user) {
          await context.User.updatePassword(user.id, reset.password);
        }
        return { errors: null };
      } catch (e) {
        return { errors: e };
      }
    }
  },
  Subscription: {
    usersUpdated: {
      subscribe: () => pubsub.asyncIterator(USERS_SUBSCRIPTION)
    }
  }
});
