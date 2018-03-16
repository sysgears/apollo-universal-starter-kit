import auth from './auth';
import resolvers from './resolvers';
import UserTabNavigator from './containers/Routes';

import modules from '..';

import Feature from '../connector';

export default new Feature(auth, {
  resolver: resolvers,
  routerFactory: () => UserTabNavigator(modules.tabItems)
});
