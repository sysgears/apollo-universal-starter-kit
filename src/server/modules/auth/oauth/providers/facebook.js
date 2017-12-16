import passport from 'passport';
import FacebookStrategy from 'passport-facebook';

import { oauthCallback, oauthLogin } from '../../flow/oauth';

import settings from '../../../../../../settings';

const config = settings.auth.authentication.oauth.providers.facebook;

const Enable = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: '/auth/facebook/callback',
        scope: config.scope,
        profileFields: config.profileFields
      },
      async function(accessToken, refreshToken, profile, cb) {
        // Here, we need to extract the data we want from the OAuth scopes
        //   and reshape it to the internal data structures and storage formats
        // This is where the OAuth particulars come into play
        //   and we normalize to our internal representations
        const { id, displayName, emails: [{ value }] } = profile;

        console.log('FACEBOOK', profile);

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
            displayName: displayName,
            firstName: profile.givenName,
            lastName: profile.familyName
          }
        };

        return oauthLogin(oauthUser, cb);
      }
    )
  );
};

const AddRoutes = app => {
  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), async function(req, res) {
    oauthCallback(req, res);
  });
};

export default {
  Enable,
  AddRoutes
};
