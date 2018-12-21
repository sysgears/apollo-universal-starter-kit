import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';
import createTokens from './createTokens';
import settings from '../../../../../settings';

const LOGOUT_FROM_ALL_DEVICES = 'logout_from_all_devices_sub';

export default pubsub => ({
  Mutation: {
    async refreshTokens(obj, { refreshToken: inputRefreshToken }, { User }) {
      const decodedToken = jwt.decode(inputRefreshToken);
      if (!decodedToken || !decodedToken.user) {
        throw new AuthenticationError('Refresh token invalid');
      }

      const user = await User.getUserWithPassword(decodedToken.user);
      const refreshSecret = settings.user.secret + user.passwordHash + user.authSalt;

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
    },
    async jwtLogoutFromAllDevices(obj, { userId }, { User }) {
      await User.increaseAuthSalt(userId);
      pubsub.publish(LOGOUT_FROM_ALL_DEVICES, {
        logoutFromAllDevicesSub: {
          mutation: 'LOGOUT_FROM_ALL_DEVICES',
          userId
        }
      });
    }
  }
});
