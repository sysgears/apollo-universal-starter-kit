import jwt from 'jsonwebtoken';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import { pick } from 'lodash';
import cookiesMiddleware from 'universal-cookie-express';

import UserDAO from './sql';
import schema from './schema.graphqls';
import createResolvers from './resolvers';
import { establishSession } from './auth';
import authMiddleware from './auth/authMiddleware';
import confirmMiddleware from './confirm';
import Feature from '../connector';
import scopes from './auth/scopes';
import settings from '../../../../settings';

const SECRET = settings.user.secret;

const User = new UserDAO();

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

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, res, connectionParams, webSocket) => {
    let loggedInUser = null;
    let auth = { isAuthenticated: false, scope: null };
    let serial = '';
    if (__DEV__) {
      // for local testing without client certificates
      serial = settings.user.auth.certificate.enabled;
    }

    if (req) {
      if (req.user) {
        loggedInUser = req.user;
      } else if (settings.user.auth.certificate.enabled) {
        const user = await User.getUserWithSerial(serial);
        if (user) {
          loggedInUser = user;
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
          loggedInUser = user;
        }
      }
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
      SECRET,
      req,
      res
    };
  },
  middleware: app => {
    app.use(cookiesMiddleware());

    app.use(async (req, res, next) => {
      try {
        await establishSession(req, SECRET);
        next();
      } catch (e) {
        next(e);
      }
    });
    app.use(authMiddleware(SECRET, User, jwt));

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
  }
});
