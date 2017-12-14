/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';
import withAuth from 'graphql-auth';
import { refreshTokens, tryLogin } from './auth';
import FieldError from '../../../common/FieldError';
import settings from '../../../../settings';

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
  UserAuth: {
    certificate(obj) {
      return obj;
    },
    facebook(obj) {
      return obj;
    },
    google(obj) {
      return obj;
    }
  },
  CertificateAuth: {
    serial(obj) {
      return obj.serial;
    }
  },
  FacebookAuth: {
    fbId(obj) {
      return obj.fbId;
    },
    displayName(obj) {
      return obj.displayName;
    }
  },
  GoogleAuth: {
    googleId(obj) {
      return obj.googleId;
    },
    displayName(obj) {
      return obj.displayName;
    }
  },
  Mutation: {
    async register(obj, { input }, context) {
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

        e.throwIf();

        let userId = 0;
        if (!emailExists) {
          let isActive = false;
          if (!settings.user.auth.password.confirm) {
            isActive = true;
          }

          [userId] = await context.User.register({ ...input, isActive });

          // if user has previously logged with facebook auth
        } else {
          await context.User.updatePassword(emailExists.userId, input.password);
          userId = emailExists.userId;
        }

        const user = await context.User.getUser(userId);

        if (context.mailer && settings.user.auth.password.sendConfirmationEmail && !emailExists && context.req) {
          // async email
          jwt.sign({ user: pick(user, 'id') }, context.SECRET, { expiresIn: '1d' }, (err, emailToken) => {
            const encodedToken = Buffer.from(emailToken).toString('base64');
            let url;
            if (__DEV__) {
              url = `${context.req.protocol}://localhost:3000/confirmation/${encodedToken}`;
            }
            url = `${context.req.protocol}://${context.req.get('host')}/confirmation/${encodedToken}`;
            context.mailer.sendMail({
              from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
              to: user.email,
              subject: 'Confirm Email',
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
    },
    async login(obj, { input: { email, password } }, context) {
      try {
        const tokens = await tryLogin(email, password, context.User, context.SECRET);
        if (context.req) {
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
    async logout(obj, args, context) {
      if (context.req) {
        context.req.universalCookies.remove('x-token');
        context.req.universalCookies.remove('x-refresh-token');

        context.req.universalCookies.remove('r-token');
        context.req.universalCookies.remove('r-refresh-token');
      }

      return true;
    },
    refreshTokens(obj, { token, refreshToken }, context) {
      return refreshTokens(token, refreshToken, context.User, context.SECRET);
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
              let url;
              if (__DEV__) {
                url = `${context.req.protocol}://localhost:3000/confirmation/${encodedToken}`;
              }
              url = `${context.req.protocol}://${context.req.get('host')}/confirmation/${encodedToken}`;
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
    ),
    async forgotPassword(obj, { input }, context) {
      try {
        const localAuth = pick(input, 'email');
        const user = await context.User.getUserByEmail(localAuth.email);

        if (user && context.mailer) {
          // async email
          jwt.sign(
            { email: user.email, password: user.password },
            context.SECRET,
            { expiresIn: '1d' },
            (err, emailToken) => {
              // encoded token since react router does not match dots in params
              const encodedToken = Buffer.from(emailToken).toString('base64');
              let url;
              if (__DEV__) {
                url = `${context.req.protocol}://localhost:3000/reset-password/${encodedToken}`;
              }
              url = `${context.req.protocol}://${context.req.get('host')}/reset-password/${encodedToken}`;
              context.mailer.sendMail({
                from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
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
    async resetPassword(obj, { input }, context) {
      try {
        const e = new FieldError();
        const reset = pick(input, ['password', 'passwordConfirmation', 'token']);
        if (reset.password !== reset.passwordConfirmation) {
          e.setError('password', 'Passwords do not match.');
        }

        if (reset.password.length < 5) {
          e.setError('password', `Password must be 5 characters or more.`);
        }
        e.throwIf();

        const token = Buffer.from(reset.token, 'base64').toString();
        const { email, password } = jwt.verify(token, context.SECRET);
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
  Subscription: {}
});
