import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';

const login = client => {
  return client.cache.reset();
};

const logout = client => {
  return client.cache.reset();
};

export default new AccessModule(jwt, session, {
  login: [login],
  logout: [logout]
});
