import { pick } from 'lodash';

import { AuthModule } from '@gqlapp/authentication-server-ts';
import settings from '@gqlapp/config';

import { onAuthenticationSuccess } from '../shared';
import User from '../../sql';
import resolvers from './resolvers';

const registerUser = async ({ id, emails: [{ value }] }) => {
  return User.register({
    username: value,
    email: value,
    password: id,
    isActive: true
  });
};

const createGoogleOAuth = async user => User.createGoogleOAuth(user);

async function verifyCallback(accessToken, refreshToken, profile, cb) {
  const {
    id,
    displayName,
    emails: [{ value }]
  } = profile;

  try {
    let user = await User.getUserByGoogleIdOrEmail(id, value);

    if (!user) {
      const [createdUserId] = await registerUser(profile);

      await createGoogleOAuth({ id, displayName, userId: createdUserId });

      await User.editUserProfile({
        id: createdUserId,
        profile: {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName
        }
      });

      user = await User.getUser(createdUserId);
    } else if (!user.googleId) {
      await createGoogleOAuth({ id, displayName, userId: user.id });
    }

    return cb(null, pick(user, ['id', 'username', 'role', 'email']));
  } catch (err) {
    return cb(err, {});
  }
}

export const googleData = {
  google: {
    onAuthenticationSuccess,
    verifyCallback
  }
};

export default (settings.auth.social.google.enabled && !__TEST__
  ? new AuthModule({ createResolversFunc: [resolvers] })
  : undefined);
