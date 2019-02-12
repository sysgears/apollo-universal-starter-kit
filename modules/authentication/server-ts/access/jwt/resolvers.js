import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';
import createTokens from './createTokens';
import settings from '../../../../../settings';

export default () => ({
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
      const hash = getHash ? await getHash(decodedToken.id) : '';
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
    }
  }
});
