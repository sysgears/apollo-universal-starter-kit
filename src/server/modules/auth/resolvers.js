/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';
import withAuth from 'graphql-auth';
import FieldError from '../../../common/FieldError';
import settings from '../../../../settings';

import { setTokenHeaders, removeTokenHeaders, refreshToken, tryLogin } from './flow';

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
      return true;
    },
    async login(obj, { input: { email, password } }, context) {
      try {
        const tokens = await tryLogin(email, password, context.User, context.SECRET);
        if (context.req) {
          setTokenHeaders(context.req, tokens);
        }
        return { tokens };
      } catch (e) {
        return { errors: e };
      }
    },
    async logout(obj, args, context) {
      if (context.req) {
        removeTokenHeaders(context.req);
      }

      return true;
    },
    refreshToken(obj, { token, refreshToken }, context) {
      return true;
    },
    async forgotPassword(obj, { input }, context) {
      return true;
    },
    async resetPassword(obj, { input }, context) {
      return true;
    }
  },
  Subscription: {}
});
