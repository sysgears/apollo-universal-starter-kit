import jwt from 'jsonwebtoken';
import createTokens from './createTokens';
import settings from '../../../../../../../settings';
import * as models from '../../../../../typings/graphql';
import * as sql from '../../sql';

interface Context {
  res: any;
  User: sql.User;
}

export default (): {
  Mutation: models.MutationResolvers.Resolvers<Context>;
} => ({
  Mutation: {
    async refreshTokens(obj, { refreshToken: inputRefreshToken }, { User, res }) {
      const { user: id }: any = jwt.decode(inputRefreshToken);

      const user: any = await User.getUserWithPassword(id);
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
