import DataLoader from 'dataloader';
import jwt from 'jsonwebtoken';

import Auth from './lib';
import schema from './schema.graphqls';
import createResolvers from './resolvers';
import Feature from '../connector';

import { confirmAccountHandler } from './flow/confirm';
import authTokenMiddleware from './middleware/token';

import OAuth from './oauth';
import { refreshToken } from './flow/token';

import UserDAO from '../entities/user/lib';

import settings from '../../../../settings';

const User = new UserDAO();

const SECRET = settings.auth.secret;
const entities = settings.entities;
const authn = settings.auth.authentication;
const authz = settings.auth.authorization;

const localAuth = new Auth();

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, connectionParams, webSocket) => {
    const tokenUser = await parseUser({ req, connectionParams, webSocket });

    console.log('Got Here');

    const scopes = authz.userScopes;
    let userScopes = null;
    let userGroups = null;
    let userOrgs = null;

    if (tokenUser) {
      userScopes = scopes[tokenUser.role];
      if (entities.groups.enabled) {
        userGroups = await User.getGroupsForUserId(tokenUser.id);
      }

      if (entities.orgs.enabled) {
        userOrgs = await User.getOrgsForUserId(tokenUser.id);
      }
    }

    const auth = {
      isAuthenticated: tokenUser ? true : false,
      scope: userScopes,
      userGroups,
      userOrgs
    };
    const loaders = {
      getUsersWithApiKeys: new DataLoader(localAuth.getUsersWithApiKeys),
      getUsersWithSerials: new DataLoader(localAuth.getUsersWithSerials),
      getUsersWithOAuths: new DataLoader(localAuth.getUsersWithOAuths)
    };

    return {
      Auth: localAuth,
      user: tokenUser,
      auth,
      SECRET,
      req,
      loaders
    };
  },
  middleware: app => {
    app.use(authTokenMiddleware(localAuth));
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
        const user = await Auth.getUserFromSerial(serial);
        if (user) {
          return user;
        }
      }
    }
  }
};
