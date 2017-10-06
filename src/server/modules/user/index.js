import jwt from 'jsonwebtoken';
import url from 'url';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import bcrypt from 'bcryptjs';
import { pick } from 'lodash';

import UserDAO from './sql';
import schema from './schema.graphqls';
import createResolvers from './resolvers';
import { refreshTokens, createTokens } from './auth';
import tokenMiddleware from './token';
import confirmMiddleware from './confirm';
import Feature from '../connector';
import settings from '../../../../settings';

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

const addressUrl = `${protocol}//${hostname}:${serverPort}`;

const SECRET = settings.user.secret;

const User = new UserDAO();

if (settings.user.auth.facebook.enabled) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: settings.user.auth.facebook.clientID,
        clientSecret: settings.user.auth.facebook.clientSecret,
        callbackURL: `${addressUrl}/auth/facebook/callback`,
        scope: ['email'],
        profileFields: ['id', 'emails', 'displayName']
      },
      async function(accessToken, refreshToken, profile, cb) {
        const { id, username, displayName, emails: [{ value }] } = profile;
        try {
          let user = await User.getUserByFbIdOrEmail(id, value);

          if (!user) {
            const passwordPromise = bcrypt.hash(id, 12);
            const isActive = true;
            const createUserPromise = User.register({ username: username ? username : displayName, isActive });
            const [password, [createdUserId]] = await Promise.all([passwordPromise, createUserPromise]);

            await User.createLocalOuth({
              email: value,
              password: password,
              userId: createdUserId
            });

            await User.createFacebookOuth({
              id,
              displayName,
              userId: createdUserId
            });

            user = await User.getUser(createdUserId);
          } else if (!user.fbId) {
            await User.createFacebookOuth({
              id,
              displayName,
              userId: user.id
            });
          }

          return cb(null, pick(user, ['id', 'username', 'isAdmin', 'email']));
        } catch (err) {
          return cb(err, {});
        }
      }
    )
  );
}

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, connectionParams, webSocket) => {
    let tokenUser = null;
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
      try {
        const { user } = jwt.verify(connectionParams.token, SECRET);
        tokenUser = user;
      } catch (err) {
        const newTokens = await refreshTokens(connectionParams.token, connectionParams.refreshToken, User, SECRET);
        tokenUser = newTokens.user;
      }
    } else if (req) {
      if (req.user) {
        tokenUser = req.user;
      } else if (settings.user.auth.certificate.enabled) {
        const user = await User.getUserWithSerial(serial);
        if (user) {
          tokenUser = user;
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
          tokenUser = user;
        }
      }
    }

    return {
      User,
      user: tokenUser,
      SECRET,
      req
    };
  },
  middlewareUse: [tokenMiddleware(SECRET, User, jwt), passport.initialize()],
  middlewareGet: [
    settings.user.auth.password.sendConfirmationEmail
      ? { path: '/confirmation/:token', callback: confirmMiddleware(SECRET, User, jwt, addressUrl) }
      : {},
    settings.user.auth.facebook.enabled ? { path: '/auth/facebook', callback: passport.authenticate('facebook') } : {},
    settings.user.auth.facebook.enabled
      ? {
          path: '/auth/facebook/callback',
          callback: passport.authenticate('facebook', { session: false }),
          callback2: async function(req, res) {
            const user = await User.getUserWithPassword(req.user.id);
            const refreshSecret = SECRET + user.password;
            const [token, refreshToken] = await createTokens(req.user, SECRET, refreshSecret);

            req.universalCookies.set('x-token', token, {
              maxAge: 60 * 60 * 24 * 7,
              httpOnly: true
            });
            req.universalCookies.set('x-refresh-token', refreshToken, {
              maxAge: 60 * 60 * 24 * 7,
              httpOnly: true
            });

            req.universalCookies.set('r-token', token, {
              maxAge: 60 * 60 * 24 * 7,
              httpOnly: false
            });
            req.universalCookies.set('r-refresh-token', refreshToken, {
              maxAge: 60 * 60 * 24 * 7,
              httpOnly: false
            });

            res.redirect(`${addressUrl}/profile`);
          }
        }
      : {}
  ]
});
