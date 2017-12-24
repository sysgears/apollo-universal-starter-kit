/*eslint-disable no-unused-vars*/
import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

import FieldError from '../../../../common/FieldError';
import { withAuth } from '../../../../common/authValidation';
import { reconcileBatchOneToOne, reconcileBatchOneToMany, reconcileBatchManyToMany } from '../../../sql/helpers';

import baseResolvers from './base';

import userResolvers from './user';
import groupResolvers from './group';
import orgResolvers from './org';
import saResolvers from './sa';

import settings from '../../../../../settings';

const entities = settings.entities;

let obj = {
  Query: {},

  Mutation: {},
  Subscription: {}
};

obj = baseResolvers(obj);

if (entities.users.enabled === true) {
  obj = userResolvers(obj);
}

if (entities.groups.enabled === true) {
  obj = groupResolvers(obj);
}

if (entities.orgs.enabled === true) {
  obj = orgResolvers(obj);
}

if (entities.serviceaccounts.enabled === true) {
  obj = saResolvers(obj);
}

export default pubsub => obj;
