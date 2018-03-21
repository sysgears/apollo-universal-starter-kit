import jwt from 'jsonwebtoken';
import createTokens from './createTokens';
import settings from '../../../../../../../settings';

export default () => ({
  Mutation: {
    async refreshTokens(obj, { refreshToken: inputRefreshToken }, { User }) {
      const { user: id } = jwt.decode(inputRefreshToken);

      const user = await User.getUserWithPassword(id);
      const refreshSecret = settings.user.secret + user.passwordHash;

      jwt.verify(inputRefreshToken, refreshSecret);

      const [accessToken, refreshToken] = await createTokens(user, settings.user.secret, refreshSecret);

      return {
        accessToken,
        refreshToken
      };
    }
  }
});
