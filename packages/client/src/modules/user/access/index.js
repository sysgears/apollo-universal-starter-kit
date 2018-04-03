import jwt from './jwt';
import session from './session';

import Feature from './connector';

export default new Feature(jwt, session);
