import * as jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import * as passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { StrategyOptionWithScope } from 'passport-facebook-ext';

import settings from '../../../../settings';
import Feature from '../connector';
import { createTokens, refreshTokens } from './auth';
import scopes from './auth/scopes';
import tokenMiddleware from './auth/token';
import confirmMiddleware from './confirm';
import createResolvers from './resolvers';
import * as schema from './schema.graphqls';
import UserDAO from './sql';

const SECRET = settings.user.secret;

const User: any = new UserDAO();

const strategyOption: StrategyOptionWithScope = {
  clientID: settings.user.auth.facebook.clientID,
  clientSecret: settings.user.auth.facebook.clientSecret,
  callbackURL: '/auth/facebook/callback',
  scope: ['email'],
  profileFields: ['id', 'emails', 'displayName']
};

if (settings.user.auth.facebook.enabled) {
  passport.use(
    new FacebookStrategy(
      strategyOption,
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        cb: (error: any, user?: any, info?: any) => void
      ) => {
        const { id, username, displayName, emails: [{ value }] } = profile;
        try {
          let user: any = await User.getUserByFbIdOrEmail(id, value);

          if (!user) {
            const isActive = true;
            const [createdUserId] = await User.register({ username: username ? username : displayName, isActive });

            await User.createLocalOuth({
              email: value,
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
  createContextFunc: async (req: any, connectionParams: any, webSocket: any) => {
    let tokenUser: any = null;
    let auth: any = { isAuthenticated: false, scope: null };
    let serial: string = '';
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
        const { user } = jwt.verify(connectionParams.token, SECRET) as any;
        tokenUser = user;
      } catch (err) {
        const newTokens: any = await refreshTokens(connectionParams.token, connectionParams.refreshToken, User, SECRET);
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

    if (tokenUser) {
      auth = {
        isAuthenticated: true,
        scope: scopes[tokenUser.role]
      };
    }

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

    if (settings.user.auth.facebook.enabled) {
      app.use(passport.initialize());

      app.get('/auth/facebook', passport.authenticate('facebook'));

      app.get(
        '/auth/facebook/callback',
        passport.authenticate('facebook', { session: false }),
        async (req: any, res: any) => {
          const user: any = await User.getUserWithPassword(req.user.id);
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
        }
      );
    }
  }
});
