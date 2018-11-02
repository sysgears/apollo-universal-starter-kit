import { pick } from 'lodash';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';

import resolvers from './resolvers';
import AuthModule from '../AuthModule';
import User from '../../sql';
import settings from '../../../../../../../settings';
import access from '../../access';
import getCurrentUser from '../utils';

let middleware;

if (settings.user.auth.facebook.enabled && !__TEST__) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: settings.user.auth.facebook.clientID,
        clientSecret: settings.user.auth.facebook.clientSecret,
        callbackURL: settings.user.auth.facebook.callbackURL,
        scope: settings.user.auth.facebook.scope,
        profileFields: settings.user.auth.facebook.profileFields
      },
      async function(accessToken, refreshToken, profile, cb) {
        const {
          id,
          username,
          displayName,
          emails: [{ value }]
        } = profile;
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

  middleware = app => {
    app.use(passport.initialize());
    app.get('/auth/facebook', (req, res, next) => {
      passport.authenticate('facebook', { state: req.query.expoUrl })(req, res, next);
    });
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), async function(req, res) {
      const user = await User.getUser(req.user.id);
      const redirectUrl = req.query.state;
      const tokens = await access.grantAccess(user, req);
      const currentUser = await getCurrentUser(req, res);

      if (redirectUrl) {
        res.redirect(
          redirectUrl +
            (tokens
              ? '?data=' +
                JSON.stringify({
                  tokens,
                  user: currentUser.data
                })
              : '')
        );
      } else {
        res.redirect('/profile');
      }
    });
  };
}

export default (middleware
  ? new AuthModule({ middleware: [middleware], createResolversFunc: [resolvers] })
  : undefined);
