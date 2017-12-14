import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import settings from '../../../../../../settings';

import { oauthCallback, oauthLogin } from '../../flow/oauth';

const config = settings.auth.authentication.oauth.providers.google;

const Enable = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: '/auth/google/callback'
      },
      async function(accessToken, refreshToken, profile, cb) {
        // Here, we need to extract the data we want from the OAuth scopes
        //   and reshape it to the internal data structures and storage formats
        // This is where the OAuth particulars come into play
        //   and we normalize to our internal representations
        const { id, emails: [{ value }] } = profile;

        console.log('GOOGLE', profile);

        /*
         * Should we be saving the provider oauth and refresh so that
         *    we can maintain our access to the scopes the granted us ?
         */

        let oauthUser = {
          isActive: true, // don't need to confirm with oauth
          email: value,
          oauth: {
            provider: 'google',
            oauthId: id
          },
          profile: {
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            language: profile._json.language
          }
        };

        return oauthLogin(oauthUser, cb);
      }
    )
  );
};

const AddRoutes = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: config.scope
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google', { session: false }), async function(req, res) {
    oauthCallback(req, res);
  });
};

export default {
  Enable,
  AddRoutes
};
