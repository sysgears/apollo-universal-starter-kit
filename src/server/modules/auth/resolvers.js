/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';
import { withAuth } from '../../../common/authValidation';
import FieldError from '../../../common/FieldError';
import settings from '../../../../settings';

import { setTokenHeaders, removeTokenHeaders, refreshToken } from './flow/token';
import { passwordRegister, passwordLogin, sendPasswordResetEmail, passwordReset } from './flow/password';
import { sendConfirmAccountEmail } from './flow/confirm';

const authn = settings.auth.authentication;

export default pubsub => ({
  Query: {},
  Mutation: {
    async register(obj, { input }, context) {
      try {
        let tokens = null;
        let user = await passwordRegister(input);

        if (authn.password.confirm) {
          if (context.mailer && authn.password.sendConfirmationEmail) {
            // async email sending
            sendConfirmAccountEmail(context.mailer, user);
          } else {
            console.log('Ugh Oh');
          }
        } else {
          console.log('Not Requiring Confirmation');
          tokens = await passwordLogin(input);
          if (context.req) {
            setTokenHeaders(context.req, tokens);
          }
        }

        return { user, tokens, errors: null };
      } catch (e) {
        return { user: null, tokens: null, errors: e };
      }
    },
    async login(obj, { input }, context) {
      try {
        const tokens = await passwordLogin(input);
        if (context.req) {
          setTokenHeaders(context.req, tokens);
        }
        return { tokens, errors: null };
      } catch (e) {
        return { tokens: null, errors: e };
      }
    },
    async registerPassword(obj, { input }, context) {
      try {
        let tokens = null;
        let user = await passwordRegister(input);

        if (authn.password.confirm) {
          console.log('Requiring Confirmation');
          if (context.mailer && authn.password.sendConfirmationEmail) {
            // async email sending
            sendConfirmAccountEmail(context.mailer, user);
          } else {
            console.log('Ugh Oh');
          }
        } else {
          console.log('Not Requiring Confirmation');
          tokens = await passwordLogin(input);
          if (context.req) {
            setTokenHeaders(context.req, tokens);
          }
        }

        return { user, tokens, errors: null };
      } catch (e) {
        return { user: null, tokens: null, errors: e };
      }
    },
    async loginPassword(obj, { input }, context) {
      try {
        const tokens = await passwordLogin(input);
        if (context.req) {
          setTokenHeaders(context.req, tokens);
        }
        return { tokens, errors: null };
      } catch (e) {
        return { tokens: null, errors: e };
      }
    },
    async forgotPassword(obj, args, context) {
      const { input } = args;
      try {
        if (context.mailer) {
          await sendPasswordResetEmail(context.mailer, input);
        }
        return true;
      } catch (e) {
        console.log('error', e);
        // always return true so you can't discover users this way
        return true;
      }
    },
    async resetPassword(obj, { input }, context) {
      try {
        await passwordReset(input);
        return { errors: null };
      } catch (e) {
        return { errors: e };
      }
    },
    async loginPasswordless(obj, { input: { email } }, context) {
      return true;
    },
    async logout(obj, args, context) {
      if (context.req) {
        removeTokenHeaders(context.req);
      }

      return true;
    },
    async refreshToken(obj, { token, refreshToken }, context) {
      try {
        const tokens = await refreshToken(token, refreshToken, context.SECRET);
        return { tokens, errors: null };
      } catch (e) {
        return { tokens: null, errors: e };
      }
    }
  },
  Subscription: {}
});
