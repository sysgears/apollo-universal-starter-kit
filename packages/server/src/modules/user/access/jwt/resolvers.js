import jwt from 'jsonwebtoken';
import createTokens from './createTokens';
import settings from '../../../../../../../settings';

export default () => ({
  Mutation: {
    async refreshTokens(obj, { refreshToken: inputRefreshToken }, { User, res }) {
      const { user: id } = jwt.decode(inputRefreshToken);

      const user = await User.getUserWithPassword(id);
      const refreshSecret = settings.user.secret + user.passwordHash;

      try {
        jwt.verify(inputRefreshToken, refreshSecret);
      } catch (e) {
        res.status(401);
        throw e;
      }

      const [accessToken, refreshToken] = await createTokens(user, settings.user.secret, refreshSecret);

      return {
        accessToken,
        refreshToken
      };
    }
  }
});
