import Feature from '../connector';

import settings from '../../../../settings';

import org from './org';
import group from './group';
import user from './user';
import sa from './sa';

const config = settings.entities;

let features = [];

if (config.enabled) {
  console.log('Features - adding - Entities');

  if (config.orgs.enabled) {
    console.log('Features - adding - Orgs');
    features.push(org);
  }

  if (config.groups.enabled) {
    console.log('Features - adding - Groups');
    features.push(group);
  }

  if (config.users.enabled) {
    console.log('Features - adding - Users');
    features.push(user);
  }

  if (config.serviceaccounts.enabled) {
    console.log('Features - adding - ServiceAccounts');
    features.push(sa);
  }
}

export default new Feature(...features);

/*
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
        getUsersForOrgIdViaGroups: new DataLoader(org.getUsersForOrgIdViaGroups),
        getServiceAccountsForOrgIdViaGroups: new DataLoader(org.getServiceAccountsForOrgIdViaGroups),

        getOrgsForGroupId: new DataLoader(group.getOrgsForGroupId),
        getUsersForGroupId: new DataLoader(group.getUsersForGroupId),
        getServiceAccountsForGroupId: new DataLoader(group.getServiceAccountsForGroupId),

        getOrgsForUserId: new DataLoader(user.getOrgsForUserId),
        getGroupsForUserId: new DataLoader(user.getGroupsForUserId),
        getOrgsForUserIdViaGroups: new DataLoader(user.getOrgsForUserIdViaGroups),

        getOrgsForServiceAccountId: new DataLoader(sa.getOrgsForServiceAccountId),
        getGroupsForServiceAccountId: new DataLoader(sa.getGroupsForServiceAccountId),
        getOrgsForServiceAccountIdViaGroups: new DataLoader(sa.getOrgsForServiceAccountIdViaGroups)
      }
    };
  }
});
*/
