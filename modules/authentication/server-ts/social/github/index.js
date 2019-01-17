import passport from 'passport';
import GitHubStrategy from 'passport-github';
import settings from '../../../../../settings';
import AuthModule from '../AuthModule';

const { clientID, clientSecret, scope, callbackURL, enabled } = settings.auth.social.github;

const middleware = (app, { context }) => {
  if (!enabled || __TEST__) {
    return false;
  }

  app.use(passport.initialize());

  app.get('/auth/github', (req, res, next) => {
    passport.authenticate('github', { state: req.query.expoUrl })(req, res, next);
  });

  app.get(
    '/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    context.social.github.onAuthenticationSuccess
  );
};

const onAppCreate = ({ context }) => {
  if (enabled && !__TEST__) {
    passport.use(
      new GitHubStrategy({ clientID, clientSecret, scope, callbackURL }, context.social.github.verifyCallback)
    );
  }
};

export default new AuthModule({
  middleware: [middleware],
  onAppCreate: [onAppCreate]
});
