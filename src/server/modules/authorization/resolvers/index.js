import baseResolvers from './base';
import permissionResolvers from './permissions';

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
obj = permissionResolvers(obj);

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

/* eslint-disable no-unused-vars */
export default pubsub => obj;
