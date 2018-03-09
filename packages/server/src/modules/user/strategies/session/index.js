import React from 'react';
import PropTypes from 'prop-types';
import cookiesMiddleware from 'universal-cookie-express';
import jwt from 'jsonwebtoken';

import UserDAO from '../../common/sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import confirmMiddleware from './confirm';
import { readSession, createSession } from './auth';
import Feature from '../../../connector';
import scopes from '../../common/auth/scopes';
import settings from '../../../../../../../settings';
import { facebookAuth, facebookStategy } from '../facebook';
import { googleAuth, googleStategy } from '../google';

const SECRET = settings.user.secret;

const User = new UserDAO();

if (settings.user.auth.facebook.enabled) {
  facebookStategy(User);
}

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

if (settings.user.auth.google.enabled) {
  googleStategy(User);
}

export const parseUser = async ({ req, connectionParams, webSocket }) => {
  let serial = '';
  if (__DEV__) {
    // for local testing without client certificates
    serial = settings.user.auth.certificate.enabled;
  }

  if (
    connectionParams &&
    connectionParams.token &&
    connectionParams.token !== 'null' &&
    connectionParams.token !== 'undefined'
  ) {
    const { user } = jwt.verify(connectionParams.token, SECRET);
    return user;
  } else if (req) {
    if (req.session.userId) {
      return await User.getUser(req.session.userId);
    } else if (req.user) {
      return req.user;
    } else if (settings.user.auth.certificate.enabled) {
      const user = await User.getUserWithSerial(serial);
      if (user) {
        return user;
      }
    }
  } else if (webSocket) {
    if (settings.user.auth.certificate.enabled) {
      // in case you need to access req headers
      if (webSocket.upgradeReq.headers['x-serial']) {
        serial = webSocket.upgradeReq.headers['x-serial'];
      }

      const user = await User.getUserWithSerial(serial);
      if (user) {
        return user;
      }
    }
  }
};

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, res, connectionParams, webSocket) => {
    const currentUser = await parseUser({ req, connectionParams, webSocket });
    const auth = {
      isAuthenticated: !!currentUser,
      scope: currentUser ? scopes[currentUser.role] : null
    };

    return {
      User,
      user: currentUser,
      auth,
      SECRET,
      req
    };
  },
  beforeware: app => {
    app.use(cookiesMiddleware());
    app.use(async (req, res, next) => {
      try {
        req.session = readSession(req);
        if (!req.session || !req.session.csrfToken) {
          req.session = createSession(req);
        }
        if (__SSR__ || __TEST__) {
          req.headers['x-token'] = req.session.csrfToken;
        }
        if (req.path === __API_URL__) {
          if (req && req.session.userId && req.session.csrfToken !== req.headers['x-token']) {
            throw new Error('CSRF token validation failed');
          }
        }
        next();
      } catch (e) {
        next(e);
      }
    });
  },
  middleware: app => {
    if (settings.user.auth.password.sendConfirmationEmail) {
      app.get('/confirmation/:token', confirmMiddleware(SECRET, User, jwt));
    }

    // Setup Facebook OAuth
    if (settings.user.auth.facebook.enabled) {
      facebookAuth('session', app, SECRET, User);
    }

    // Setup Google OAuth
    if (settings.user.auth.google.enabled) {
      googleAuth('session', app, SECRET, User);
    }
  },
  htmlHeadComponent: <CSRFComponent />
});
