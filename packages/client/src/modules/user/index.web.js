import auth from './auth';
import resolvers from './resolvers';

import Feature from '../connector';

export default new Feature(auth, {
  resolver: resolvers
});
