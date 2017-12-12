import { pick } from 'lodash';
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import settings from '../../../../../../settings';

import { setTokenHeaders, createToken } from '../../flow';

import User from '../../../entities/user';
import Auth from '../../sql';

const SECRET = settings.auth.secret;

const Enable = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: settings.user.auth.oauth.providers.google.clientID,
        clientSecret: settings.user.auth.oauth.providers.google.clientSecret,
        callbackURL: '/auth/google/callback'
      },
      async function(accessToken, refreshToken, profile, cb) {
        const { id, displayName, emails: [{ value }] } = profile;
        try {
          let user = await Auth.searchUserByOAuthIdOrEmail('google', id, value);

          if (!user) {
            const [createdUserId] = await User.register({
              email: value,
              password: id,
              isActive: true
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
            // User has registered another way and the email matches here
            // Add an entry for the
            await Auth.createUserOAuth('google', id, user.id);
          }

          return cb(null, pick(user, ['id', 'username', 'role', 'email']));
        } catch (err) {
          return cb(err, {});
        }
      }
    )
  );
};

const AddRoutes = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: settings.auth.oauth.providers.google.scope
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google', { session: false }), async function(req, res) {
    const user = await Auth.getUserWithPassword(req.user.id);

    const refreshSecret = SECRET + user.password;
    const [token, refreshToken] = await createToken(req.user, SECRET, refreshSecret);

    setTokenHeaders(req, { token, refreshToken });

    res.redirect('/profile');
  });
};

export default {
  Enable,
  AddRoutes
};
