import DataLoader from 'dataloader';
import jwt from 'jsonwebtoken';

import schema from './schema.graphqls';
import createResolvers from './resolvers';
import Feature from '../connector';

import { confirmAccountHandler } from './flow/confirm';
import authTokenMiddleware from './middleware/token';

import OAuth from './oauth';
import { refreshToken } from './flow/token';

import settings from '../../../../settings';
import log from '../../../common/log';

import AuthDAO from './lib';

const SECRET = settings.auth.secret;
const entities = settings.entities;
const authn = settings.auth.authentication;

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, connectionParams, webSocket) => {
    try {
      const tokenUser = await parseUser({ req, connectionParams, webSocket });

      let userScopes = [];
      let allRoles = {};

      const Auth = new AuthDAO();

      const loaders = {
        getUsersWithApiKeys: new DataLoader(Auth.getUsersWithApiKeys),
        getUsersWithSerials: new DataLoader(Auth.getUsersWithSerials),
        getUsersWithOAuths: new DataLoader(Auth.getUsersWithOAuths)
      };

      if (tokenUser) {
        // TODO replace the following with a call to replace static scope lookup with a dynamic one
        // // ALSO, make this configurable, static or dynamic role/permission sets

        if (entities.orgs.enabled) {
          allRoles = await Auth.getUserWithAllRoles(tokenUser.id);

          for (let role of allRoles.userRoles) {
            userScopes = userScopes.concat(role.scopes);
          }
        }
      }

      const auth = {
        isAuthenticated: tokenUser ? true : false,
        scope: userScopes,
        userScopes,
        userRoles: allRoles.userRoles,
        groupRoles: allRoles.groupRoles,
        orgRoles: allRoles.orgRoles
      };

      // console.log("currentUserAuth - graphql context", auth)

      return {
        Auth: Auth,
        user: tokenUser,
        auth,
        SECRET,
        req,
        loaders
      };
    } catch (e) {
      log.error(e);
      throw e;
    }
  },
  middleware: app => {
    app.use(authTokenMiddleware(AuthDAO));
    if (authn.password.sendConfirmationEmail) {
      app.get('/confirmation/:token', confirmAccountHandler);
    }

    if (authn.oauth.enabled === true) {
      OAuth.Enable(app);
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
      const newToken = await refreshToken(connectionParams.token, connectionParams.refreshToken, SECRET);
      return newToken.user;
    }
  } else if (req) {
    if (req.user) {
      return req.user;
    }
    if (authn.apikey.enabled) {
      let apikey = '';
      // in case you need to access req headers
      if (req.headers['apikey']) {
        apikey = req.headers['apikey'];
      }

      if (apikey !== '') {
        const Auth = new AuthDAO();
        const user = await Auth.getUserFromApiKey(apikey);
        if (user) {
          return user;
        }
      }
    }

    if (authn.certificate.enabled) {
      let serial = '';
      // in case you need to access req headers
      if (req.headers['x-serial']) {
        serial = req.headers['x-serial'];
      }

      if (serial !== '') {
        const Auth = new AuthDAO();
        const user = await Auth.getUserFromSerial(serial);
        if (user) {
          return user;
        }
      }
    }
  } else if (webSocket) {
    if (authn.apikey.enabled) {
      let apikey = '';
      // in case you need to access req headers
      if (webSocket.upgradeReq.headers['apikey']) {
        apikey = webSocket.upgradeReq.headers['apikey'];
      }

      if (apikey !== '') {
        const Auth = new AuthDAO();
        const user = await Auth.getUserFromApiKey(apikey);
        if (user) {
          return user;
        }
      }
    } else if (authn.certificate.enabled) {
      let serial = '';
      // in case you need to access req headers
      if (webSocket.upgradeReq.headers['x-serial']) {
        serial = webSocket.upgradeReq.headers['x-serial'];
      }

      if (serial !== '') {
        const Auth = new AuthDAO();
        const user = await Auth.getUserFromSerial(serial);
        if (user) {
          return user;
        }
      }
    }
  }
};
