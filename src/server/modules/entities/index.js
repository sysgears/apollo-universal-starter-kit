import DataLoader from 'dataloader';

import schema from './schema.graphqls';
import createResolvers from './resolvers';
import Feature from '../connector';

import Org from './org';
import Group from './group';
import User from './user';
import ServiceAccount from './sa';

const org = new Org();
const group = new Group();
const user = new User();
const sa = new ServiceAccount();

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    return {
      Org: org,
      Group: group,
      User: user,
      ServiceAccount: sa,

      loaders: {
        getGroupsForOrgId: new DataLoader(org.getGroupsForOrgId),
        getUsersForOrgId: new DataLoader(org.getUsersForOrgId),
        getServiceAccountsForOrgId: new DataLoader(org.getServiceAccountsForOrgId),

        getOrgsForGroupId: new DataLoader(group.getOrgsForGroupId),
        getUsersForGroupId: new DataLoader(group.getUsersForGroupId),
        getServiceAccountsForGroupId: new DataLoader(group.getServiceAccountsForGroupId),

        getOrgsForUserId: new DataLoader(user.getOrgsForUserId),
        getGroupsForUserId: new DataLoader(user.getGroupsForUserId),

        getOrgsForServiceAccountId: new DataLoader(sa.getOrgsForServiceAccountId),
        getGroupsForServiceAccountId: new DataLoader(sa.getGroupsForServiceAccountId)
      }
    };
  }
});
