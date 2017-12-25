/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { reconcileBatchOneToOne } from '../../../stores/sql/knex/helpers/batching';

import apikeyResolvers from './apikey';

import userBaseResolvers from './userBase';
import userPasswordResolvers from './userPassword';
import userPasswordlessResolvers from './userPasswordless';
import userApikeyResolvers from './userApikeys';
import userCertResolvers from './userCert';
import userOAuthResolvers from './userOAuth';

import saApikeyResolvers from './saApikeys';
import saCertResolvers from './saCert';

import settings from '../../../../../settings';

const authn = settings.auth.authentication;

// Starting object, we assume users are enabled
let obj = {
  Query: {},

  User: {
    auth: obj => {
      return obj;
    }
  },

  UserAuth: {},

  Mutation: {},
  Subscription: {}
};

obj = userBaseResolvers(obj);

console.log('OBJ', obj);

// Configurable User Authentication

if (authn.password.enabled) {
  obj = userPasswordResolvers(obj);
}

if (authn.passwordless.enabled) {
  obj = userPasswordlessResolvers(obj);
}

if (authn.apikey.enabled) {
  obj = apikeyResolvers(obj);
  obj = userApikeyResolvers(obj);
}

if (authn.certificate.enabled) {
  obj = userCertResolvers(obj);
}

if (authn.oauth.enabled) {
  obj = userOAuthResolvers(obj);
}

// Service account setup

if (settings.entities.serviceaccounts.enabled === true) {
  obj.ServiceAccount = {
    auth: obj => {
      return obj;
    }
  };

  obj.ServiceAccountAuth = {};

  if (authn.apikeys.enabled) {
    obj = saApikeyResolvers(obj);
  }

  if (authn.certificates.enabled) {
    obj = saCertResolvers(obj);
  }
}

export default pubsub => obj;
