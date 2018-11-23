import { AuthenticationError } from 'apollo-server-errors';

import { writeSession, createSession, readSession } from './sessions';
import { passwordBasedHmac } from './crypto';
import { isApiExternal } from '../../../../net';
import AccessModule from '../AccessModule';
import schema from './schema.graphql';
import resolvers from './resolvers';
import scopes from '../../scopes';
import User from '../../sql';
import settings from '../../../../../../../settings';

const grant = async (user, req) => {
  const session = {
    ...req.session,
    userId: user.id,
    userIdMAC: passwordBasedHmac(user.id, user.passwordHash)
  };

  req.session = writeSession(req, session);
};

const maintainUserInSession = async (context, req) => {
  let user = context.user;
  if (req) {
    req.session = readSession(req);
    if (!user && req.session && req.session.userId) {
      // Get user from userId stored inside session
      user = await User.getUserWithPassword(req.session.userId);
      // Validate user from session
      if (!user || passwordBasedHmac(user.id, user.passwordHash) !== req.session.userIdMAC) {
        // User do not exist or user has changed password, recreate session
        req.session = createSession(req);
        throw new AuthenticationError('SessionExpiredError');
      }
    }
    if (!req.session) {
      req.session = createSession(req);
    } else {
      if (!isApiExternal && req.path === __API_URL__) {
        if (req.universalCookies.get('x-token') !== req.session.csrfToken) {
          req.session = createSession(req);
          throw new Error('CSRF token validation failed');
        }
      }
    }
  }
  return user;
};

const createContextFunc = async ({ req, res, context }) => {
  const user = await maintainUserInSession(context, req, res);
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

export default new AccessModule(
  settings.user.auth.access.session.enabled
    ? {
        grant: [grant],
        schema: [schema],
        createResolversFunc: [resolvers],
        createContextFunc: [createContextFunc]
      }
    : {}
);
