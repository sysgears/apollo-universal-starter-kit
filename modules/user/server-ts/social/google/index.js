import { pick } from 'lodash';
import { AuthModule } from '@module/authentication-server-ts';
import { onAuthenticationSuccess } from '../shared';
import User from '../../sql';
import resolvers from './resolvers';
import settings from '../../../../../settings';

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
    } else if (!user.lnId) {
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