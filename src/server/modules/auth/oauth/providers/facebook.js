import { pick } from 'lodash';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';

import User from '../../../entities/user';
import Auth from '../../sql';

import { setTokenHeaders, createToken } from '../../flow';

import settings from '../../../../../../settings';

const SECRET = settings.auth.secret;

const Enable = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: settings.auth.oauth.providers.facebook.clientID,
        clientSecret: settings.auth.oauth.providers.facebook.clientSecret,
        callbackURL: '/auth/facebook/callback',
        scope: settings.auth.oauth.providers.facebook.scope,
        profileFields: settings.auth.oauth.providers.facebook.profileFields
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
};

const AddRoutes = app => {
  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), async function(req, res) {
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
