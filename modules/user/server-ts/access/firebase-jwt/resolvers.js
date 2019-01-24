import firebase from 'firebase-admin';
import 'firebase/auth';
import { AuthenticationError } from 'apollo-server-errors';
import createTokens from './createTokens';

export default () => ({
  Mutation: {
    async refreshTokens(obj, { refreshToken: inputRefreshToken }, { User }) {
      const decodedToken = await firebase.auth().verifyIdToken(inputRefreshToken);
      if (!decodedToken || !decodedToken.uid) {
        throw new AuthenticationError('Refresh token invalid');
      }
      const { uid } = decodedToken;
      const { email } = firebase.auth().getUser(uid);
      const user = await User.getUserByEmail(email);
      user.uid = uid;

      const [accessToken, refreshToken] = await createTokens(user);

      return {
        accessToken,
        refreshToken
      };
    }
  }
});
