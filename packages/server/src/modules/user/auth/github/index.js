import { pick } from 'lodash';
import passport from 'passport';
import GitHubStrategy from 'passport-github';

import resolvers from './resolvers';
import AuthModule from '../AuthModule';
import User from '../../sql';
import settings from '../../../../../../../settings';
import access from '../../access';
import getCurrentUser from '../utils';

let middleware;

if (settings.user.auth.github.enabled && !__TEST__) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: settings.user.auth.github.clientID,
        clientSecret: settings.user.auth.github.clientSecret,
        scope: settings.user.auth.github.scope,
        callbackURL: settings.user.auth.github.callbackURL
      },
      async function(accessToken, refreshToken, profile, cb) {
        const {
          id,
          username,
          displayName,
          emails: [{ value }]
        } = profile;
        try {
          let user = await User.getUserByGHIdOrEmail(id, value);

          if (!user) {
            const isActive = true;
            const [createdUserId] = await User.register({
              username: username ? username : displayName,
              email: value,
              password: id,
              isActive
            });

            await User.createGithubAuth({
              id,
              displayName,
              userId: createdUserId
            });

            user = await User.getUser(createdUserId);
          } else if (!user.ghId) {
            await User.createGithubAuth({
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

  middleware = app => {
    app.use(passport.initialize());
    app.get('/auth/github', (req, res, next) => {
      passport.authenticate('github', { state: req.query.expoUrl })(req, res, next);
    });
    app.get(
      '/auth/github/callback',
      passport.authenticate('github', { session: false, failureRedirect: '/login' }),
      async function(req, res) {
        const user = await User.getUser(req.user.id);
        const redirectUrl = req.query.state;
        const tokens = await access.grantAccess(user, req);
        const currentUser = await getCurrentUser(req, res);

        if (redirectUrl) {
          res.redirect(
            redirectUrl +
              (tokens
                ? '?data=' +
                  JSON.stringify({
                    tokens,
                    user: currentUser.data
                  })
                : '')
          );
        } else {
          res.redirect('/profile');
        }
      }
    );
  };
}

export default (middleware
  ? new AuthModule({ middleware: [middleware], createResolversFunc: [resolvers] })
  : undefined);
