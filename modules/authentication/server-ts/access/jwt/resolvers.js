import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';
import createTokens from './createTokens';
import settings from '../../../../../settings';

const MESSAGE_INVALID_TOKEN = 'Error: Refresh token invalid';
const MESSAGE_GET_IDENTIFY =
  'Error: Can not find "getIdentifyWithPassword" method. Please, add this method to the context.';
const MESSAGE_WITHOUT_ID = 'Error: Identify must have "id" method.';

const throwError = message => {
  throw new AuthenticationError(message);
};

export default () => ({
  Mutation: {
    async refreshTokens(obj, { refreshToken: inputRefreshToken }, { getIdentifyWithPassword, getHash }) {
      const decodedToken = jwt.decode(inputRefreshToken);
      const isValidToken = !decodedToken || !decodedToken.identity;
      const isGetIdentifyerExist = getIdentifyWithPassword || typeof getIdentifyWithPassword === 'function';

      !isValidToken && throwError(MESSAGE_INVALID_TOKEN);
      !isGetIdentifyerExist && throwError(MESSAGE_GET_IDENTIFY);

      const user = await getIdentifyWithPassword(decodedToken.identity);
      const refreshSecret = settings.auth.secret + getHash(user);

      try {
        jwt.verify(inputRefreshToken, refreshSecret);
      } catch (e) {
        throwError(e);
      }

      !user.id && throwError(MESSAGE_WITHOUT_ID);

      const [accessToken, refreshToken] = await createTokens(user, settings.auth.secret, refreshSecret);

      return {
        accessToken,
        refreshToken
      };
    }
  }
});
