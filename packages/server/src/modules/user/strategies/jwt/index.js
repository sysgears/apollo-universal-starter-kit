import jwt from 'jsonwebtoken';

import UserDAO from '../../sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import { refreshTokens } from './auth';
import tokenMiddleware from './token';
import confirmMiddleware from './confirm';
import Feature from '../../../connector';
import scopes from '../../scopes';
import settings from '../../../../../../../settings';
import { facebookStategy, facebookAuth } from '../facebook';
import { googleStategy, googleAuth } from '../google';

const SECRET = settings.user.secret;

const User = new UserDAO();

if (settings.user.auth.facebook.enabled) {
  facebookStategy(User);
}

if (settings.user.auth.google.enabled) {
  googleStategy(User);
}

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
      const newTokens = await refreshTokens(connectionParams.token, connectionParams.refreshToken, User, SECRET);
      return newTokens.user;
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

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, res, connectionParams, webSocket) => {
    const tokenUser = await parseUser({ req, connectionParams, webSocket });
    const auth = {
      isAuthenticated: !!tokenUser,
      scope: tokenUser ? scopes[tokenUser.role] : null
    };
    return {
      User,
      user: tokenUser,
      auth,
      SECRET,
      req
    };
  },
  middleware: app => {
    app.use(tokenMiddleware(SECRET, User, jwt));

    if (settings.user.auth.password.sendConfirmationEmail) {
      app.get('/confirmation/:token', confirmMiddleware(SECRET, User, jwt));
    }

    // Setup Facebook OAuth
    if (settings.user.auth.facebook.enabled) {
      facebookAuth('jwt', app, SECRET, User);
    }

    // Setup Google OAuth
    if (settings.user.auth.google.enabled) {
      googleAuth('jwt', app, SECRET, User);
    }
  }
});
