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
  /*
  createContextFunc: () => ({
    Org: new Org(),
    Group: new Group(),
    User: new User(),
    ServiceAccount: new ServiceAccount()
  })
  */
  createContextFunc: () => {
    return {
      Org: org,
      Group: group,
      User: user,
      ServiceAccount: sa

      /*
      loaders: {
        getGroupsForUserIds: new DataLoader(user.getGroupsForUserIds)
      }
      */
    };
  }
});
