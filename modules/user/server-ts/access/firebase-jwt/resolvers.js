import firebase from 'firebase-admin';
import 'firebase/auth';
import { AuthenticationError } from 'apollo-server-errors';
// import createToken from './createToken';

export default () => ({
  Mutation: {
    async refreshTokens(obj, { refreshToken: inputRefreshToken }) {
      const decodedToken = await firebase.auth().verifyIdToken(inputRefreshToken);
      if (!decodedToken || !decodedToken.uid) {
        throw new AuthenticationError('Refresh token invalid');
      }
      return {
        inputRefreshToken
      };
    }
  }
});
