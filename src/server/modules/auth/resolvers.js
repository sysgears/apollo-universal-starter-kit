/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';
import withAuth from 'graphql-auth';
import FieldError from '../../../common/FieldError';
import settings from '../../../../settings';

import { setTokenHeaders, removeTokenHeaders, refreshToken } from './flow/token';
import { passwordRegister, passwordLogin } from './flow/password';
import { sendConfirmAccountEmail } from './flow/confirm';

const authn = settings.auth.authentication;

export default pubsub => ({
  Query: {},
  UserAuth: {
    apikeys(obj, args, context) {
      return context.loaders.getUserWithApiKeys.load(obj.id);
    },
    certificates(obj, args, context) {
      return context.loaders.getUserWithSerials.load(obj.id);
    },
    oauths(obj, args, context) {
      return context.loaders.getUserWithOAuths.load(obj.id);
    }
  },
  ServiceAccountAuth: {
    apikey(obj, args, context) {
      return context.loaders.getUserWithApiKeys.load(obj.id);
    },
    certificate(obj, args, context) {
      return context.loaders.getUserWithSerials.load(obj.id);
    }
  },
  CertificateAuth: {
    name(obj) {
      return obj.name;
    },
    serial(obj) {
      return obj.serial;
    }
  },
  ApiKeyAuth: {
    name(obj) {
      return obj.name;
    },
    key(obj) {
      return obj.key;
    }
  },
  UserOAuth: {
    provider(obj) {
      return obj.provider;
    }
  },
  Mutation: {
    async register(obj, { input }, context) {
      try {
        let tokens = null;
        let user = await passwordRegister(input);

        if (authn.confirm) {
          if (context.mailer && authn.password.sendConfirmationEmail && context.req) {
            // async email sending
            sendConfirmAccountEmail(context.mailer, user);
          }
        } else {
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
      return true;
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
    async forgotPassword(obj, { input }, context) {
      return true;
    },
    async resetPassword(obj, { input }, context) {
      return true;
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
    refreshToken(obj, { token, refreshToken }, context) {
      return true;
    }
  },
  Subscription: {}
});
