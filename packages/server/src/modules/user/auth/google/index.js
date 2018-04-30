import { pick } from 'lodash';
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import resolvers from './resolvers';
import Feature from '../connector';
import UserDAO from '../../sql';
import access from '../../access';
import settings from '../../../../../../../settings';

let middleware;

if (settings.user.auth.google.enabled && !__TEST__) {
  const User = new UserDAO();

  passport.use(
    new GoogleStrategy(
      {
        clientID: settings.user.auth.google.clientID,
        clientSecret: settings.user.auth.google.clientSecret,
        callbackURL: '/auth/google/callback'
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
      const user = await User.getUserWithPassword(req.user.id);
      const redirectUrl = req.query.state;
      const tokens = await access.grantAccess(user, req);

      if (redirectUrl) {
        res.redirect(
          redirectUrl +
            (tokens
              ? '?data=' +
                JSON.stringify({
                  tokens
                })
              : '')
        );
      } else {
        res.redirect('/profile');
      }
    });
  };
}

export default new Feature({ middleware, createResolversFunc: resolvers });
