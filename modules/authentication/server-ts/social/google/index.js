import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import settings from '../../../../../settings';
import AuthModule from '../AuthModule';

const { clientID, clientSecret, scope, callbackURL, enabled } = settings.auth.social.google;

const middleware = (app, { social }) => {
  if (!enabled || __TEST__) {
    return false;
  }

  app.use(passport.initialize());

  app.get('/auth/google', (req, res, next) => {
    passport.authenticate('google', { scope, state: req.query.expoUrl })(req, res, next);
  });

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    social.google.onAuthenticationSuccess
  );
};

const onAppCreate = ({ appContext }) => {
  if (enabled && !__TEST__) {
    passport.use(new GoogleStrategy({ clientID, clientSecret, callbackURL }, appContext.social.google.verifyCallback));
  }
};

export default new AuthModule({
  middleware: [middleware],
  onAppCreate: [onAppCreate]
});
