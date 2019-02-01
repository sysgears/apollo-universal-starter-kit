import { pick, isEmpty } from 'lodash';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server-errors';
import firebase from 'firebase-admin';
import access from '../../access';
import settings from '../../../../../settings';

export default () => ({
  Mutation: {
    async login(
      obj,
      {
        input: { email, errorCode, token }
      },
      { req, User }
    ) {
      let errors = {};
      if (errorCode) {
        if (errorCode === 'auth/wrong-password') {
          errors = { password: req.t('user:auth.password.validPassword') };
        }
        if (errorCode === 'auth/user-not-found') {
          errors = { email: req.t('user:auth.password.validPasswordEmail') };
        }
        if (errorCode === 'auth/too-many-requests') {
          errors = { email: req.t('user:auth.tooManyRequests') };
        }
      }
      const user = await User.getUserByEmail(email);
      if (user && settings.user.auth.password.confirm && !user.isActive) {
        errors = { email: req.t('user:auth.password.emailConfirmation') };
      }
      if (!isEmpty(errors)) throw new UserInputError(errorCode, { errors });

      await access.grantAccess(token, req);

      const { passwordHash, ...userWithoutPass } = user;
      console.log(userWithoutPass);

      return { userWithoutPass };
    },
    async register(obj, { input }, { User, req }) {
      const { t } = req;
      const isActive = !settings.user.auth.password.confirm;
      const { errors, id } = await User.register(...input, isActive);

      // Firebase errors
      if (errors.code === 'auth/email-already-exists') {
        errors.email = t('firebase:auth.password.emailIsExisted');
      }
      if (errors.code === 'auth/invalid-password') {
        errors.password = t('firebase:auth.password.passwordLength');
      }

      if (!isEmpty(errors)) throw new UserInputError('Failed reset password', { errors });

      const user = await User.getUser(id);

      return { user };
    },
    async forgotPassword(obj, { input }, context) {
      try {
        const localAuth = pick(input, 'email');
        const user = await context.User.getUserByEmail(localAuth.email);

        if (user && context.mailer) {
          // async email
          jwt.sign(
            { email: user.email, password: user.passwordHash },
            settings.user.secret,
            { expiresIn: '1d' },
            (err, emailToken) => {
              // encoded token since react router does not match dots in params
              const encodedToken = Buffer.from(emailToken).toString('base64');
              const url = `${__WEBSITE_URL__}/reset-password/${encodedToken}`;
              context.mailer.sendMail({
                from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'Reset Password',
                html: `Please click this link to reset your password: <a href="${url}">${url}</a>`
              });
            }
          );
        }
      } catch (e) {
        // don't throw error so you can't discover users this way
      }
    },
    async resetPassword(
      obj,
      { input },
      {
        req: { t },
        User
      }
    ) {
      const errors = {};

      const reset = pick(input, ['password', 'passwordConfirmation', 'token']);
      if (reset.password !== reset.passwordConfirmation) {
        errors.password = t('user:auth.password.passwordsIsNotMatch');
      }

      if (reset.password.length < settings.user.auth.password.minLength) {
        errors.password = t('user:auth.password.passwordLength', { length: settings.user.auth.password.minLength });
      }

      if (!isEmpty(errors)) throw new UserInputError('Failed reset password', { errors });

      const token = Buffer.from(reset.token, 'base64').toString();
      const { email, password } = jwt.verify(token, settings.user.secret);
      const user = await User.getUserByEmail(email);
      if (user.passwordHash !== password) {
        throw new Error(t('user:auth.password.invalidToken'));
      }
      if (user) {
        if (settings.user.auth.firebase.enabled) {
          const { uid } = await firebase.auth().getUserByEmail(email);
          await firebase.auth().updateUser(uid, { password: reset.password });
        }
        await User.updatePassword(user.id, reset.password);
      }
    }
  }
});
