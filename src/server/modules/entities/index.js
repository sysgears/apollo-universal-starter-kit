import schema from './schema.graphqls';
import createResolvers from './resolvers';
import Feature from '../connector';

import Org from './org';
import Group from './group';
import User from './user';
import ServiceAccount from './sa';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({
    Org: new Org(),
    Group: new Group(),
    User: new User(),
    ServiceAccount: new ServiceAccount()
  })
});
