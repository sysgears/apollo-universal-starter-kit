import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';

import { AuthModule } from '../AuthModule';

const createMiddleware = onAuthenticationSuccess => app => {
  app.use(passport.initialize());

  app.get('/auth/linkedin', (req, res, next) => {
    passport.authenticate('linkedin', { state: req.query.expoUrl })(req, res, next);
  });

  app.get(
    '/auth/linkedin/callback',
    passport.authenticate('linkedin', { session: false, failureRedirect: '/login' }),
    onAuthenticationSuccess
  );
};

const getLinkedInAuth = config => {
  const {
    enabled,
    clientID,
    clientSecret,
    callbackURL,
    scope,
    resolvers,
    verifyCallback,
    onAuthenticationSuccess
  } = config;

  if (!enabled || __TEST__) {
    return undefined;
  }

  passport.use(new LinkedInStrategy({ clientID, clientSecret, callbackURL, scope }, verifyCallback));

  const middleware = createMiddleware(onAuthenticationSuccess);

  return new AuthModule({
    middleware: [middleware],
    createResolversFunc: [resolvers]
  });
};

export default getLinkedInAuth;
