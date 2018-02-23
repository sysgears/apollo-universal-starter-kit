import { pick } from 'lodash';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import MobileDetect from 'mobile-detect';
import { createTokens } from '../jwt/auth';
import { updateSession } from '../session/auth';
import { encryptSession } from './../session/auth/crypto';
import settings from '../../../../../../../settings';

export function facebookStategy(User) {
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

export function facebookAuth(module, app, SECRET, User) {
  app.use(passport.initialize());
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), async function(req, res) {
    const user = await User.getUserWithPassword(req.user.id);
    const md = new MobileDetect(req.headers['user-agent']);
    const port = md.os() === 'iOS' ? '19500' : '19000';

    if (module === 'jwt') {
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
      if (['iOS', 'AndroidOS'].includes(md.os())) {
        res.redirect(
          `${settings.user.MOBILE_APP_URL}:${port}/+?data=` +
            JSON.stringify({
              tokens: { token: token, refreshToken: refreshToken }
            })
        );
      } else {
        res.redirect('/profile');
      }
    } else if (module === 'session') {
      if (req.user && req.user.id) {
        req.session.userId = req.user.id;
      }
      await updateSession(req, req.session);
      if (['iOS', 'AndroidOS'].includes(md.os())) {
        res.redirect(
          `${settings.user.MOBILE_APP_URL}:${port}/+?data=` +
            JSON.stringify({
              session: encryptSession(req.session)
            })
        );
      } else {
        res.redirect('/profile');
      }
    }
  });
}
