import DataLoader from 'dataloader';
import jwt from 'jsonwebtoken';

import User from '../entities/user';

import Auth from './sql';
import schema from './schema.graphqls';
import createResolvers from './resolvers';
import Feature from '../connector';

import createConfirmHandler from './flow/confirm';

// import OAuth from './oauth';
import { refreshToken } from './flow';

import settings from '../../../../settings';

const SECRET = settings.auth.secret;

const localAuth = new Auth();

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
      Auth: localAuth,
      user: tokenUser,
      auth,
      SECRET,
      req,
      loaders: {
        getUserWithApiKeys: new DataLoader(localAuth.getUserWithApiKeys),
        getUserWithSerials: new DataLoader(localAuth.getUserWithSerials),
        getUserWithOAuths: new DataLoader(localAuth.getUserWithOAuths)
      }
    };
  },
  middleware: app => {
    if (settings.auth.authentication.password.sendConfirmationEmail) {
      app.get('/confirmation/:token', createConfirmHandler(SECRET, User, jwt));
    }

    if (settings.auth.authentication.oauth.enabled === true) {
      // OAuth.Enable(app);
    }
  }
});

/*
 * Extracts a user from the connection, looks in the order:
 *  - jwt-token
 *  - apikey
 *  - certificate
 */
export const parseUser = async ({ req, connectionParams, webSocket }) => {
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
    } else if (settings.auth.authentication.apikey.enabled) {
      let apikey = '';
      // in case you need to access req headers
      if (req.headers['apikey']) {
        apikey = req.headers['apikey'];
      }

      if (apikey !== '') {
        const user = await Auth.getUserFromApiKey(apikey);
        if (user) {
          return user;
        }
      }
    } else if (settings.auth.authentication.certificate.enabled) {
      let serial = '';
      // in case you need to access req headers
      if (req.headers['x-serial']) {
        serial = req.headers['x-serial'];
      }

      if (serial !== '') {
        const user = await Auth.getUserWithSerial(serial);
        if (user) {
          return user;
        }
      }
    }
  } else if (webSocket) {
    if (settings.auth.authentication.apikey.enabled) {
      let apikey = '';
      // in case you need to access req headers
      if (webSocket.upgradeReq.headers['apikey']) {
        apikey = webSocket.upgradeReq.headers['apikey'];
      }

      if (apikey !== '') {
        const user = await Auth.getUserFromApiKey(apikey);
        if (user) {
          return user;
        }
      }
    } else if (settings.auth.authentication.certificate.enabled) {
      let serial = '';
      // in case you need to access req headers
      if (webSocket.upgradeReq.headers['x-serial']) {
        serial = webSocket.upgradeReq.headers['x-serial'];
      }

      if (serial !== '') {
        const user = await Auth.getUserWithSerial(serial);
        if (user) {
          return user;
        }
      }
    }
  }
};
