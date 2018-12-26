import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';
import createTokens from './createTokens';
import settings from '../../../../../settings';

export default () => ({
  Mutation: {
    async refreshTokens(obj, { refreshToken: inputRefreshToken }, { User }) {
      const decodedToken = jwt.decode(inputRefreshToken);
      if (!decodedToken || !decodedToken.user) {
        throw new AuthenticationError('Refresh token invalid');
      }

      const user = await User.getUserWithPassword(decodedToken.user);
      const refreshSecret = settings.user.secret + user.passwordHash;

      try {
        jwt.verify(inputRefreshToken, refreshSecret);
      } catch (e) {
        throw new AuthenticationError(e);
      }

      const [accessToken, refreshToken] = await createTokens(user, settings.user.secret, refreshSecret);

      return {
        accessToken,
        refreshToken
      };
    }
  }
});
