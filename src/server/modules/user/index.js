import jwt from 'jsonwebtoken';
import url from 'url';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';

import UserDAO from './sql';
import schema from './schema.graphqls';
import createResolvers from './resolvers';
import { refreshTokens } from './auth';
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

passport.use(
  new FacebookStrategy(
    {
      clientID: settings.user.auth.facebook.clientID,
      clientSecret: settings.user.auth.facebook.clientSecret,
      callbackURL: `${addressUrl}/auth/facebook/callback`
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      /*User.findOrCreate({ facebookId: profile.id }, function(err, user) {
        return cb(err, user);
      });*/
      return cb(null, {});
    }
  )
);

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
    { path: '/confirmation/:token', callback: confirmMiddleware(SECRET, User, jwt, addressUrl) },
    { path: '/auth/facebook', callback: passport.authenticate('facebook') },
    {
      path: '/auth/facebook/callback',
      callback: passport.authenticate('facebook', { session: false }),
      callback2: function(req, res) {
        res.redirect(`${addressUrl}/profile`);
      }
    }
  ]
});
