import jwt from 'jsonwebtoken';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { pick } from 'lodash';

import UserDAO from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import { refreshTokens, createTokens } from './auth';
import tokenMiddleware from './auth/token';
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
        scope: settings.user.auth.facebook.scope,
        profileFields: settings.user.auth.facebook.profileFields
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

          return cb(null, pick(user, ['id', 'username', 'role', 'email']));
        } catch (err) {
          return cb(err, {});
        }
      }
    )
  );
}

if (settings.user.auth.google.enabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: settings.user.auth.google.clientID,
        clientSecret: settings.user.auth.google.clientSecret,
        callbackURL: '/auth/google/callback'
      },
      async function(accessToken, refreshToken, profile, cb) {
        const { id, username, displayName, emails: [{ value }] } = profile;
        try {
          let user = await User.getUserByGoogleIdOrEmail(id, value);

          if (!user) {
            const isActive = true;
            const [createdUserId] = await User.register({
              username: username ? username : value,
              email: value,
              password: id,
              isActive
            });

            await User.createGoogleOuth({
              id,
              displayName,
              userId: createdUserId
            });

            await User.editUserProfile({
              id: createdUserId,
              profile: {
                firstName: profile.name.givenName,
                lastName: profile.name.familyName
              }
            });

            user = await User.getUser(createdUserId);
          } else if (!user.googleId) {
            await User.createGoogleOuth({
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
    try {
      const { user } = jwt.verify(connectionParams.token, SECRET);
      return user;
    } catch (err) {
      const newTokens = await refreshTokens(connectionParams.token, connectionParams.refreshToken, User, SECRET);
      return newTokens.user;
    }
  } else if (req) {
    if (req.user) {
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
  createContextFunc: async (req, connectionParams, webSocket) => {
    const tokenUser = await parseUser({ req, connectionParams, webSocket });
    const auth = {
      isAuthenticated: tokenUser ? true : false,
      scope: tokenUser ? scopes[tokenUser.role] : null
    };

    return {
      User,
      user: tokenUser,
      auth,
      SECRET,
      req
    };
  },
  middleware: app => {
    app.use(tokenMiddleware(SECRET, User, jwt));

    if (settings.user.auth.password.sendConfirmationEmail) {
      app.get('/confirmation/:token', confirmMiddleware(SECRET, User, jwt));
    }

    // Setup Facebook OAuth
    if (settings.user.auth.facebook.enabled) {
      app.use(passport.initialize());

      app.get('/auth/facebook', passport.authenticate('facebook'));

      app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), async function(
        req,
        res
      ) {
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

        res.redirect('/profile');
      });
    }

    // Setup Google OAuth
    if (settings.user.auth.google.enabled) {
      app.use(passport.initialize());

      app.get(
        '/auth/google',
        passport.authenticate('google', {
          scope: settings.user.auth.google.scope
        })
      );

      app.get('/auth/google/callback', passport.authenticate('google', { session: false }), async function(req, res) {
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

        res.redirect('/profile');
      });
    }
  }
});
