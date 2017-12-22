/*eslint-disable no-unused-vars*/
import { pick } from 'lodash';
import { withAuth } from '../../../../common/authValidation';

import settings from '../../../../../settings';

let obj = {
  Query: {},

  User: {
    auth: obj => {
      return obj;
    }
  },

  UserAuth: {
    apikeys: (obj, args, context) => {
      return context.loaders.getApiKeysForUsers.load(obj.id);
    },
    certificates: (obj, args, context) => {
      return context.loaders.getCertificatesForUsers.load(obj.id);
    },
    oauths: (obj, args, context) => {
      return context.loaders.getOAuthsForUsers.load(obj.id);
    }
  },

  CertificateAuth: {
    name: obj => {
      return obj.name;
    },
    serial: obj => {
      return obj.serial;
    }
  },

  ApiKeyAuth: {
    name: obj => {
      return obj.name;
    },
    key: obj => {
      return obj.key;
    }
  },

  UserOAuth: {
    provider: obj => {
      return obj.provider;
    }
  },

  Mutation: {},
  Subscription: {}
};

if (settings.entities.serviceaccounts.enabled === true) {
  obj.ServiceAccount = {
    auth: obj => {
      return obj;
    }
  };

  obj.ServiceAccountAuth = {
    apikeys: (obj, args, context) => {
      return context.loaders.getApiKeysForServiceAccounts.load(obj.id);
    },
    certificates: (obj, args, context) => {
      return context.loaders.getCertificatesForServiceAccounts.load(obj.id);
    }
  };
}

export default pubsub => obj;
