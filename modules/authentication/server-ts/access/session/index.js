import { isApiExternal } from '@module/core-common';
import { User, scopes } from '@module/user-server-ts';

import { writeSession, createSession, readSession } from './sessions';
import AccessModule from '../AccessModule';
import schema from './schema.graphql';
import resolvers from './resolvers';
import settings from '../../../../../settings';

const grant = async (identity, req) => {
  const session = {
    ...req.session,
    identityId: identity.id
  };

  req.session = writeSession(req, session);
};

const getCurrentUser = async ({ req, getIdentify }) => {
  if (req && req.session.identityId) {
    return await getIdentify(req.session.identityId);
  }
};

const checkCSRFToken = req => {
  if (isApiExternal && req.path !== __API_URL__) {
    return false;
  }

  if (req.universalCookies.get('x-token') !== req.session.csrfToken) {
    req.session = createSession(req);
    throw new Error('CSRF token validation failed');
  }
};

const attachSession = req => {
  if (!req) {
    return false;
  }

  req.session = readSession(req);
  return req.session ? checkCSRFToken(req) : (req.session = createSession(req));
};

const createContextFunc = async ({ req, context }) => {
  const { getIdentify } = context;
  attachSession(req);
  const user = context.user || (await getCurrentUser({ req, getIdentify }));
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
  settings.auth.session.enabled
    ? {
        grant: [grant],
        schema: [schema],
        createResolversFunc: [resolvers],
        createContextFunc: [createContextFunc]
      }
    : {}
);
