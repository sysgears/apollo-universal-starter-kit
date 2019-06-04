import { withFilter } from 'graphql-subscriptions';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthenticationError } from 'apollo-server-errors';

import settings from '@gqlapp/config';

import createTokens from './createTokens';

const LOGOUT_SUBSCRIPTION = 'LOGOUT_SUBSCRIPTION';

const createHash = (hash, authSalt = 1) => {
  return bcrypt.hash(`${hash}${authSalt}`, 12) || false;
};

export default pubsub => ({
  Mutation: {
    async refreshTokens(
      obj,
      { refreshToken: inputRefreshToken },
      {
        getIdentity,
        getHash,
        req: { t }
      }
    ) {
      const decodedToken = jwt.decode(inputRefreshToken);
      const isValidToken = decodedToken && decodedToken.id;

      if (!isValidToken) {
        throw new AuthenticationError(t('auth:invalidRefresh'));
      }

      if (!getIdentity) {
        throw new AuthenticationError(t('auth:getIdentify'));
      }

      const identity = await getIdentity(decodedToken.id);
      const identityHash = getHash ? await getHash(decodedToken.id) : '';
      const hash = createHash(identityHash, identity.authSalt);

      const refreshSecret = settings.auth.secret + hash;

      try {
        jwt.verify(inputRefreshToken, refreshSecret);
      } catch (e) {
        throw new AuthenticationError(e);
      }

      const [accessToken, refreshToken] = await createTokens(identity, settings.auth.secret, refreshSecret);

      return {
        accessToken,
        refreshToken
      };
    },
    async logoutFromAllDevices(obj, { accessToken: token }, { updateAuthSalt, getHash, getIdentity }) {
      const {
        identity: { id }
      } = jwt.decode(token);

      await updateAuthSalt(id);

      const updatedIdentity = await getIdentity(id);
      const identityHash = getHash ? await getHash(id) : '';
      const hash = createHash(identityHash, updatedIdentity.authSalt);

      const refreshSecret = `${settings.auth.secret}${hash}`;
      const [accessToken, refreshToken] = await createTokens(updatedIdentity, settings.auth.secret, refreshSecret);

      pubsub.publish(LOGOUT_SUBSCRIPTION, {
        subscriptionLogoutFromAllDevices: {
          token
        }
      });

      return {
        accessToken,
        refreshToken
      };
    }
  },
  Subscription: {
    subscriptionLogoutFromAllDevices: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(LOGOUT_SUBSCRIPTION),
        (payload, variables) => {
          const {
            subscriptionLogoutFromAllDevices: { token: pToken }
          } = payload;
          const { token: vToken } = variables;

          const { identity: pIdentity } = jwt.decode(pToken);
          const { identity: vIdentity } = jwt.decode(vToken);
          return pIdentity.id === vIdentity.id && pToken !== vToken;
        }
      )
    }
  }
});
