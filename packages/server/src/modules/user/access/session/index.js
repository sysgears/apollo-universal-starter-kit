import { updateSession } from './sessions';
import Feature from '../connector';
import scopes from '../../scopes';
import UserDAO from '../../sql';

const User = new UserDAO();

const grant = async (user, req) => {
  const session = {
    ...req.session,
    userId: user.id
  };

  req.session = updateSession(req, session);
};

const revoke = async req => {
  const session = { ...req.session };

  delete session.userId;

  req.session = updateSession(req, session);
};

const getCurrentUser = async ({ req }) => {
  if (req && req.session && req.session.userId) {
    return await User.getUser(req.session.userId);
  }
};

const createContextFunc = async (req, res, connectionParams, webSocket) => {
  const user = await getCurrentUser({ req, connectionParams, webSocket });
  const auth = {
    isAuthenticated: !!user,
    scope: user ? scopes[user.role] : null
  };

  return {
    User,
    user,
    auth
  };
};

export default new Feature({
  grant,
  revoke,
  createContextFunc
});
