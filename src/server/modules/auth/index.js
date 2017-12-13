import DataLoader from 'dataloader';
import jwt from 'jsonwebtoken';

import User from '../entities/user';

import Auth from './sql';
import schema from './schema.graphqls';
import createResolvers from './resolvers';
import Feature from '../connector';

import createConfirmHandler from './flow/confirm';
import authTokenMiddleware from './middleware/token';

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
    console.log('tokenUser', tokenUser);
    // scope: tokenUser ? scopes[tokenUser.role] : null
    // need to look up in database eventually
    const scopes = 'admin';

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
    app.use(authTokenMiddleware(localAuth));
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
  console.log('parseUser');
  if (
    connectionParams &&
    connectionParams.token &&
    connectionParams.token !== 'null' &&
    connectionParams.token !== 'undefined'
  ) {
    console.log('JWT');
    try {
      const { user } = jwt.verify(connectionParams.token, SECRET);
      console.log('has user', user);
      return user;
    } catch (err) {
      const newToken = await refreshToken(connectionParams.token, connectionParams.refreshToken, User, SECRET);
      return newToken.user;
    }
  } else if (req) {
    console.log('REQ', req.headers);
    if (req.user) {
      console.log('has user', req.user);
      return req.user;
    }
    if (settings.auth.authentication.apikey.enabled) {
      console.log('apikey?');
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
    }

    if (settings.auth.authentication.certificate.enabled) {
      console.log('serial?');
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
    console.log('WS');
    if (settings.auth.authentication.apikey.enabled) {
      console.log('apikey?');
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
      console.log('serial?');
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
