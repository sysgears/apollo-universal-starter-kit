import { pick } from 'lodash';

import { AuthModule } from '@gqlapp/authentication-server-ts';
import settings from '@gqlapp/config';

import { onAuthenticationSuccess, registerUser } from '../shared';
import User from '../../sql';
import resolvers from './resolvers';

const createLinkedInAuth = async user => User.createLinkedInAuth(user);

async function verifyCallback(accessToken, refreshToken, profile, cb) {
  const {
    id,
    displayName,
    emails: [{ value }]
  } = profile;

  try {
    let user = await User.getUserByLnInIdOrEmail(id, value);

    if (!user) {
      const [createdUserId] = await registerUser(profile);
      await createLinkedInAuth({ id, displayName, userId: createdUserId });
      user = await User.getUser(createdUserId);
    } else if (!user.lnId) {
      await createLinkedInAuth({ id, displayName, userId: user.id });
    }

    return cb(null, pick(user, ['id', 'username', 'role', 'email']));
  } catch (err) {
    return cb(err, {});
  }
}

export const linkedinData = {
  linkedin: {
    onAuthenticationSuccess,
    verifyCallback
  }
};

export default (settings.auth.social.linkedin.enabled && !__TEST__
  ? new AuthModule({ createResolversFunc: [resolvers] })
  : undefined);
