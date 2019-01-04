import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';
import createTokens from './createTokens';
import settings from '../../../../../settings';
import { MESSAGE_INVALID_REFRESH, MESSAGE_GET_IDENTIFY } from '../errorMessages';

const throwError = message => {
  throw new AuthenticationError(message);
};

export default () => ({
  Mutation: {
    async refreshTokens(obj, { refreshToken: inputRefreshToken }, { getIdentity, getHash }) {
      const decodedToken = jwt.decode(inputRefreshToken);
      const isValidToken = !decodedToken || !decodedToken.id;

      !isValidToken && throwError(MESSAGE_INVALID_REFRESH);
      !getIdentity && throwError(MESSAGE_GET_IDENTIFY);

      const identity = await getIdentity(decodedToken.id);
      const refreshSecret = settings.auth.secret + getHash ? getHash(decodedToken.id) : '';

      try {
        jwt.verify(inputRefreshToken, refreshSecret);
      } catch (e) {
        throwError(e);
      }

      const [accessToken, refreshToken] = await createTokens(identity, settings.auth.secret, refreshSecret);

      return {
        accessToken,
        refreshToken
      };
    }
  }
});
