import jwt from 'jsonwebtoken';

// Components
import UserDAO from './sql';

import schema from './schema.graphqls';
import createResolvers from './resolvers';
import { refreshTokens } from './auth';
import tokenMiddleware from './token';
import Feature from '../connector';
import settings from '../../../../settings';

const SECRET = settings.user.secret;

const User = new UserDAO();

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, connectionParams, webSocket) => {
    let tokenUser = null;
    let serial = '';
    if (__DEV__) {
      // for local testing without client certificates
      serial = '00';
    }

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
      if (req.user) {
        tokenUser = req.user;
      } else if (settings.user.auth.certificate) {
        const user = await User.getUserWithSerial(serial);
        if (user) {
          tokenUser = user;
        }
      }
    } else if (webSocket) {
      if (settings.user.auth.certificate) {
        // in case you need to access req headers
        if (webSocket.upgradeReq.headers['x-serial']) {
          serial = webSocket.upgradeReq.headers['x-serial'];
        }

        const user = await User.getUserWithSerial(serial);
        if (user) {
          tokenUser = user;
        }
      }
    }

    return {
      User,
      user: tokenUser,
      SECRET,
      req
    };
  },
  middlewareUse: tokenMiddleware(SECRET, User),
  middlewareGet: [
    {
      path: '/confirmation/:token',
      callback: async (req, res) => {
        res.send('confirmation');

        /*try {
          const { user: { id } } = jwt.verify(req.params.token, SECRET);
          await User.update({ confirmed: true }, { where: { id } });
        } catch (e) {
          res.send('error');
        }

        return res.redirect('http://localhost:3000/login');*/
      }
    }
  ]
});
