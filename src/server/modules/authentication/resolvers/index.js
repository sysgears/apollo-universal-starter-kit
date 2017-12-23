/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { reconcileBatchOneToOne } from '../../../sql/helpers';

import settings from '../../../../../settings';

let obj = {
  Query: {},

  User: {
    auth: obj => {
      return obj;
    }
  },

  UserAuth: {
    apikeys: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.userId));
      const apikeys = await context.Authn.getApiKeysForUsers(ids);
      const ret = reconcileBatchOneToOne(source, apikeys, 'userId');
      return ret;
    }),
    certificates: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.userId));
      const certs = await context.Authn.getCertificatesForUsers(ids);
      const ret = reconcileBatchOneToOne(source, certs, 'userId');
      return ret;
    }),
    oauths: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.userId));
      const oauths = await context.Authn.getOAuthsForUsers(ids);
      const ret = reconcileBatchOneToOne(source, oauths, 'userId');
      return ret;
    })
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
    apikeys: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.serviceaccountId));
      const apikeys = await context.Authn.getApiKeysForServiceAccounts(ids);
      const ret = reconcileBatchOneToOne(source, apikeys, 'serviceaccountId');
      return ret;
    }),
    certificates: createBatchResolver(async (source, args, context) => {
      let ids = _.uniq(source.map(s => s.serviceaccountId));
      const certs = await context.Authn.getCertificatesForServiceAccounts(ids);
      const ret = reconcileBatchOneToOne(source, certs, 'serviceaccountId');
      return ret;
    })
  };
}

export default pubsub => obj;
