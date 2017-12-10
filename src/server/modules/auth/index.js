import jwt from 'jsonwebtoken';

import User from '../entities/user';

import Auth from './sql';
import schema from './schema.graphqls';
import createResolvers from './resolvers';
import Feature from '../connector';

import createConfirmHandler from './flow/confirm';

import OAuth from './oauth';
import { refreshToken } from './flow';

import settings from '../../../../settings';

const SECRET = settings.auth.secret;

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, connectionParams, webSocket) => {
    const tokenUser = await parseUser({ req, connectionParams, webSocket });
    //
    // scope: tokenUser ? scopes[tokenUser.role] : null
    // need to look up in database eventually
    const scopes = '*';

    const auth = {
      isAuthenticated: tokenUser ? true : false,
      scopes
    };

    return {
      Auth: Auth(),
      user: tokenUser,
      auth,
      SECRET,
      req
    };
  },
  middleware: app => {
    if (settings.auth.password.sendConfirmationEmail) {
      app.get('/confirmation/:token', createConfirmHandler(SECRET, User, jwt));
    }

    if (settings.auth.oauth.enabled === true) {
      OAuth.Enable(app);
    }
  }
});

export const parseUser = async ({ req, connectionParams, webSocket }) => {
  let serial = '';
  if (__DEV__) {
    // for local testing without client certificates
    serial = settings.user.auth.certificate.enabled;
  }

  if (
    connectionParams &&
    connectionParams.token &&
    connectionParams.token !== 'null' &&
    connectionParams.token !== 'undefined'
  ) {
    try {
      const { user } = jwt.verify(connectionParams.token, SECRET);
      return user;
    } catch (err) {
      const newToken = await refreshToken(connectionParams.token, connectionParams.refreshToken, User, SECRET);
      return newToken.user;
    }
  } else if (req) {
    if (req.user) {
      return req.user;
    } else if (settings.user.auth.certificate.enabled) {
      const user = await User.getUserWithSerial(serial);
      if (user) {
        return user;
      }
    }
  } else if (webSocket) {
    if (settings.user.auth.certificate.enabled) {
      // in case you need to access req headers
      if (webSocket.upgradeReq.headers['x-serial']) {
        serial = webSocket.upgradeReq.headers['x-serial'];
      }

      const user = await User.getUserWithSerial(serial);
      if (user) {
        return user;
      }
    }
  }
};
