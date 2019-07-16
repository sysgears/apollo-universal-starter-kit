import passport from 'passport';
import FacebookStrategy from 'passport-facebook';

import settings from '@gqlapp/config';

import AuthModule from '../AuthModule';

const { clientID, clientSecret, scope, callbackURL, profileFields, enabled } = settings.auth.social.facebook;

const middleware = (app, { social }) => {
  if (!enabled || __TEST__) {
    return false;
  }

  app.use(passport.initialize());

  app.get('/auth/facebook', (req, res, next) => {
    passport.authenticate('facebook', { state: req.query.expoUrl })(req, res, next);
  });

  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
    social.facebook.onAuthenticationSuccess
  );
};

const onAppCreate = async ({ appContext }) => {
  if (enabled && !__TEST__) {
    passport.use(
      new FacebookStrategy(
        { clientID, clientSecret, scope, callbackURL, profileFields },
        appContext.social.facebook.verifyCallback
      )
    );
  }
};

export default new AuthModule({
  middleware: [middleware],
  onAppCreate: [onAppCreate]
});
