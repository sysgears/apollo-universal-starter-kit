import jwt from './modules/jwt'; // eslint-disable-line
import session from './modules/session'; // eslint-disable-line
import commonResolvers from './auth/resolvers';
import UserTabNavigator from './auth/containers/Routes';

import modules from '..';

import Feature from '../connector';

const commonFeature = new Feature({ resolver: commonResolvers });

export default new Feature(commonFeature, jwt, {
  routerFactory: () => UserTabNavigator(modules.tabItems)
});
