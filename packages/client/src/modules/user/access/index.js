import jwt from './jwt';
import session from './session';

import Feature from './connector';

const login = client => {
  return client.cache.reset();
};

const logout = client => {
  return client.cache.reset();
};

export default new Feature(jwt, session, {
  login,
  logout
});
