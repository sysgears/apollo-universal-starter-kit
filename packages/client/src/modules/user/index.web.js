import jwt from './strategies/jwt'; // eslint-disable-line
import session from './strategies/session'; // eslint-disable-line
import commonResolvers from './resolvers';

import Feature from '../connector';

const commonFeature = new Feature({ resolver: commonResolvers });

export default new Feature(commonFeature, jwt);
