import DataLoader from 'dataloader';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../../connector';

import OrgDAO from './lib';

const Org = new OrgDAO();

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    return {
      Org,

      loaders: {
        getGroupsForOrgId: new DataLoader(Org.getGroupsForOrgId),
        getUsersForOrgId: new DataLoader(Org.getUsersForOrgId),
        getServiceAccountsForOrgId: new DataLoader(Org.getServiceAccountsForOrgId),
        getUsersForOrgIdViaGroups: new DataLoader(Org.getUsersForOrgIdViaGroups),
        getServiceAccountsForOrgIdViaGroups: new DataLoader(Org.getServiceAccountsForOrgIdViaGroups)
      }
    };
  }
});
