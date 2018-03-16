import { refreshTokens } from './tokens';
import settings from '../../../../../../../settings';

export default () => ({
  Mutation: {
    refreshTokens(obj, { token, refreshToken }, context) {
      return refreshTokens(token, refreshToken, context.User, settings.user.secret);
    }
  }
});
