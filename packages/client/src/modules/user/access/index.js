import jwt from './jwt';
import session from './session';

import Feature from './connector';

const login = client => {
  return client.resetStore();
};

const logout = client => {
  return client.resetStore();
};

export default new Feature(jwt, session, {
  login,
  logout
});
