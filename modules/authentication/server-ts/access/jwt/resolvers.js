import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';
import createTokens from './createTokens';
import settings from '../../../../../settings';
import { MESSAGE_INVALID_REFRESH, MESSAGE_GET_IDENTIFY } from '../errorMessages';

export default () => ({
  Mutation: {
    async refreshTokens(obj, { refreshToken: inputRefreshToken }, { getIdentity, getHash }) {
      const decodedToken = jwt.decode(inputRefreshToken);
      const isValidToken = decodedToken && decodedToken.id;

      if (!isValidToken) {
        throw new AuthenticationError(MESSAGE_INVALID_REFRESH);
      }

      if (!getIdentity) {
        throw new AuthenticationError(MESSAGE_GET_IDENTIFY);
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
