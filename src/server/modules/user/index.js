import jwt from 'jsonwebtoken';

// Components
import UserDAO from './sql';

import schema from './schema.graphqls';
import createResolvers from './resolvers';
import { refreshTokens } from './auth';
import tokenMiddleware from './token';
import Feature from '../connector';
import settings from '../../../../settings';

const SECRET = settings.secret;

const User = new UserDAO();

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, connectionParams, webSocket) => {
    let tokenUser = null;

    if (
      connectionParams &&
      connectionParams.token &&
      connectionParams.token !== 'null' &&
      connectionParams.token !== 'undefined'
    ) {
      try {
        const { user } = jwt.verify(connectionParams.token, SECRET);
        tokenUser = user;
      } catch (err) {
        const newTokens = await refreshTokens(connectionParams.token, connectionParams.refreshToken, User, SECRET);
        tokenUser = newTokens.user;
      }
    } else if (req) {
      tokenUser = req.user;
    } else if (webSocket) {
      // in case you need to access req headers
      //console.log(webSocket.upgradeReq.headers);
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
