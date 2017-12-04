import React from 'react';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import { pick } from 'lodash';
import url from 'url';
import cookiesMiddleware from 'universal-cookie-express';

import UserDAO from './sql';
import schema from './schema.graphqls';
import createResolvers from './resolvers';
import { readSession, createSession } from './auth';
import confirmMiddleware from './confirm';
import Feature from '../connector';
import scopes from './auth/scopes';
import settings from '../../../../settings';

const SECRET = settings.user.secret;

const User = new UserDAO();

const { pathname } = url.parse(__BACKEND_URL__);

if (settings.user.auth.facebook.enabled) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: settings.user.auth.facebook.clientID,
        clientSecret: settings.user.auth.facebook.clientSecret,
        callbackURL: '/auth/facebook/callback',
        scope: ['email'],
        profileFields: ['id', 'emails', 'displayName']
      },
      async function(accessToken, refreshToken, profile, cb) {
        const { id, username, displayName, emails: [{ value }] } = profile;
        try {
          let user = await User.getUserByFbIdOrEmail(id, value);

          if (!user) {
            const isActive = true;
            const [createdUserId] = await User.register({
              username: username ? username : displayName,
              email: value,
              password: id,
              isActive
            });

            await User.createFacebookAuth({
              id,
              displayName,
              userId: createdUserId
            });

            user = await User.getUser(createdUserId);
          } else if (!user.fbId) {
            await User.createFacebookAuth({
              id,
              displayName,
              userId: user.id
            });
          }

          return cb(null, pick(user, ['id', 'username', 'role', 'email']));
        } catch (err) {
          return cb(err, {});
        }
      }
    )
  );
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

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, res, connectionParams, webSocket) => {
    let loggedInUser = null;
    let auth = { isAuthenticated: false, scope: null };

    if (req) {
      if (req.session.userId) {
        loggedInUser = await User.getUser(req.session.userId);
      }
    } else if (webSocket) {
      // Add implementation here
    }

    if (loggedInUser) {
      auth = {
        isAuthenticated: true,
        scope: scopes[loggedInUser.role]
      };
    }

    return {
      User,
      user: loggedInUser,
      auth,
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
        if (req.path === pathname) {
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

    if (settings.user.auth.facebook.enabled) {
      app.use(passport.initialize());

      app.get('/auth/facebook', passport.authenticate('facebook'));

      app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), async function(
        req,
        res
      ) {
        res.redirect('/profile');
      });
    }
  },
  htmlHeadComponent: <CSRFComponent />
});
