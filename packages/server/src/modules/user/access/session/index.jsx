import React from 'react';
import PropTypes from 'prop-types';

import { writeSession, createSession, readSession } from './sessions';
import { isApiExternal } from '../../../../net';
import Feature from '../connector';
import schema from './schema.graphql';
import resolvers from './resolvers';
import scopes from '../../scopes';
import UserDAO from '../../sql';
import settings from '../../../../../../../settings';

const User = new UserDAO();

const grant = async (user, req) => {
  const session = {
    ...req.session,
    userId: user.id
  };

  req.session = writeSession(req, session);
};

const getCurrentUser = async ({ req }) => {
  if (req && req.session.userId) {
    return await User.getUser(req.session.userId);
  }
};

const createContextFunc = async (req, res, connectionParams, webSocket, context) => {
  if (req) {
    req.session = readSession(req);
    if (!req.session) {
      req.session = createSession(req);
    } else {
      if (!isApiExternal && req.path === __API_URL__) {
        if (req.headers['x-token'] !== req.session.csrfToken) {
          throw new Error('CSRF token validation failed');
        }
      }
    }
  }
  const user = context.user || (await getCurrentUser({ req, connectionParams, webSocket }));
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

const CSRFComponent = ({ req }) => (
  <script
    dangerouslySetInnerHTML={{
      __html: `window.__CSRF_TOKEN__="${req.session.csrfToken}";`
    }}
    charSet="UTF-8"
  />
);
CSRFComponent.propTypes = {
  req: PropTypes.object
};

export default new Feature(
  settings.user.auth.access.session.enabled
    ? {
        grant,
        schema,
        createResolversFunc: resolvers,
        createContextFunc,
        htmlHeadComponent: <CSRFComponent />
      }
    : {}
);
