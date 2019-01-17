import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import settings from '../../../../../settings';
import AuthModule from '../AuthModule';

const { clientID, clientSecret, scope, callbackURL, enabled } = settings.auth.social.google;

const middleware = (app, { context }) => {
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
    context.social.google.onAuthenticationSuccess
  );
};

const onAppCreate = ({ context }) => {
  if (enabled && !__TEST__) {
    passport.use(new GoogleStrategy({ clientID, clientSecret, callbackURL }, context.social.google.verifyCallback));
  }
};

export default new AuthModule({
  middleware: [middleware],
  onAppCreate: [onAppCreate]
});
