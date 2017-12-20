import DataLoader from 'dataloader';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../connector';

import OrgDAO from './lib';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    const Org = new OrgDAO();

    const loaders = {
      // Load things from OrgIds
      getGroupsForOrgId: new DataLoader(Org.getGroupsForOrgId),
      getUsersForOrgId: new DataLoader(Org.getUsersForOrgId),
      getServiceAccountsForOrgId: new DataLoader(Org.getServiceAccountsForOrgId),
      getUsersForOrgIdViaGroups: new DataLoader(Org.getUsersForOrgIdViaGroups),
      getServiceAccountsForOrgIdViaGroups: new DataLoader(Org.getServiceAccountsForOrgIdViaGroups),

      // Load Orgs from other things
      getOrgsForUserIds: new DataLoader(Org.getOrgsForUserIds),
      getOrgsForUserIdsViaGroups: new DataLoader(Org.getOrgsForUserIdsViaGroups)
    };

    return {
      Org,
      loaders
    };
  }
});
