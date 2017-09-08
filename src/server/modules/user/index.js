import jwt from 'jsonwebtoken';

// Components
import UserDAO from './sql';

import schema from './schema.graphqls';
import createResolvers from './resolvers';
import { refreshTokens } from './auth';
import tokenMiddleware from './token';
import Feature from '../connector';

const SECRET = 'secret, change for production';

const User = new UserDAO();

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, connectionParams) => {
    let tokenUser = null;

    if (
      connectionParams &&
      connectionParams.token &&
      connectionParams.token !== 'null'
    ) {
      try {
        const { user } = jwt.verify(connectionParams.token, SECRET);
        tokenUser = user;
      } catch (err) {
        const newTokens = await refreshTokens(
          connectionParams.token,
          connectionParams.refreshToken,
          User,
          SECRET
        );
        tokenUser = newTokens.user;
      }
    } else if (req) {
      tokenUser = req.user;
    }

    return {
      User,
      user: tokenUser,
      SECRET,
      req
    };
  },
  middleware: tokenMiddleware(SECRET, User)
});
