import jwt from './modules/jwt'; // eslint-disable-line
import session from './modules/session'; // eslint-disable-line
import commonFeature from './common';

import Feature from '../connector';

export default new Feature(commonFeature, session);
