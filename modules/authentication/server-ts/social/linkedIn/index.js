import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import settings from '../../../../../settings';
import AuthModule from '../AuthModule';

const { clientID, clientSecret, scope, callbackURL, enabled } = settings.auth.social.linkedin;

const middleware = (app, { social }) => {
  if (!enabled || __TEST__) {
    return false;
  }

  app.use(passport.initialize());

  app.get('/auth/linkedin', (req, res, next) => {
    passport.authenticate('linkedin', { state: req.query.expoUrl })(req, res, next);
  });

  app.get(
    '/auth/linkedin/callback',
    passport.authenticate('linkedin', { session: false, failureRedirect: '/login' }),
    social.linkedin.onAuthenticationSuccess
  );
};

const onAppCreate = ({ appContext }) => {
  if (enabled && !__TEST__) {
    passport.use(
      new LinkedInStrategy({ clientID, clientSecret, callbackURL, scope }, appContext.social.linkedin.verifyCallback)
    );
  }
};

export default new AuthModule({
  middleware: [middleware],
  onAppCreate: [onAppCreate]
});
