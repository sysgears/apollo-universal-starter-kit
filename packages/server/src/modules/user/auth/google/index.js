import { pick } from 'lodash';
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import resolvers from './resolvers';
import AuthModule from '../AuthModule';
import User from '../../sql';
import access from '../../access';
import settings from '../../../../../../../settings';
import getCurrentUser from '../utils';

let middleware;

if (settings.user.auth.google.enabled && !__TEST__) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: settings.user.auth.google.clientID,
        clientSecret: settings.user.auth.google.clientSecret,
        callbackURL: settings.user.auth.google.callbackURL
      },
      async function(accessToken, refreshToken, profile, cb) {
        const {
          id,
          username,
          displayName,
          emails: [{ value }]
        } = profile;
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

            await User.createGoogleOAuth({
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
            await User.createGoogleOAuth({
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
    app.get('/auth/google', (req, res, next) => {
      passport.authenticate('google', {
        scope: settings.user.auth.google.scope,
        state: req.query.expoUrl
      })(req, res, next);
    });

    app.get('/auth/google/callback', passport.authenticate('google', { session: false }), async function(req, res) {
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
