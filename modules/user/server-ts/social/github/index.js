import { pick } from 'lodash';
import { access } from '@module/authentication-server-ts';
import { AuthModule } from '@module/authentication-server-ts/social';
import User from '../../sql';

import resolvers from './resolvers';
import settings from '../../../../../settings';

const registerUser = async ({ id, username, displayName, emails: [{ value }] }) => {
  return User.register({
    username: username ? username : displayName,
    email: value,
    password: id,
    isActive: true
  });
};

const createGithubAuth = async user => User.createGithubAuth(user);

async function verifyCallback(accessToken, refreshToken, profile, cb) {
  const {
    id,
    displayName,
    emails: [{ value }]
  } = profile;

  try {
    let user = await User.getUserByGHIdOrEmail(id, value);

    if (!user) {
      const [createdUserId] = await registerUser(profile);
      await createGithubAuth({ id, displayName, userId: createdUserId });
      user = await User.getUser(createdUserId);
    } else if (!user.lnId) {
      await createGithubAuth({ id, displayName, userId: user.id });
    }

    return cb(null, pick(user, ['id', 'username', 'role', 'email']));
  } catch (err) {
    return cb(err, {});
  }
}

async function onAuthenticationSuccess(req, res) {
  const user = await User.getUserWithPassword(req.user.id);
  const redirectUrl = req.query.state;
  const tokens = await access.grantAccess(user, req, user.passwordHash);

  if (redirectUrl) {
    res.redirect(redirectUrl + (tokens ? '?data=' + JSON.stringify({ tokens }) : ''));
  } else {
    res.redirect('/profile');
  }
}

export const githubData = {
  github: {
    onAuthenticationSuccess,
    verifyCallback
  }
};

export default (settings.auth.social.github.enabled && !__TEST__
  ? new AuthModule({ createResolversFunc: [resolvers] })
  : undefined);
