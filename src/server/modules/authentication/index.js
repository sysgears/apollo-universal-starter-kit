import _ from 'lodash';

import Feature from '../connector';

import schema from './schema';
import createResolvers from './resolvers';
import Authn from './lib';

import Authz from '../authorization/lib';

import { confirmAccountHandler } from './flow/confirm';
import authTokenMiddleware from './middleware/token';

import OAuth from './oauth';
import parseUser from './flow/parseUser';

import settings from '../../../../settings';
import log from '../../../common/log';

const SECRET = settings.auth.secret;
const entities = settings.entities;
const authn = settings.auth.authentication;

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: async (req, connectionParams, webSocket) => {
    try {
      let userScopes = [];
      let userRolesAndPermissions = [];
      let groupRolesAndPermissions = [];
      let orgRolesAndPermissions = [];

      const tokenUser = await parseUser({ req, connectionParams, webSocket });
      // console.log('Auth - Context - tokenUser', tokenUser);

      if (tokenUser) {
        // TODO replace the following with a call to replace static scope lookup with a dynamic one
        // // ALSO, make this configurable, static or dynamic role/permission sets

        if (entities.orgs.enabled) {
          userRolesAndPermissions = await Authz.getUserRolesAndPermissionsForUser({ id: tokenUser.id });
          groupRolesAndPermissions = await Authz.getGroupRolesAndPermissionsForUser({ id: tokenUser.id });
          orgRolesAndPermissions = await Authz.getOrgRolesAndPermissionsForUser({ id: tokenUser.id });

          // console.log(orgRolesAndPermissions[0].permissions)

          userScopes = _.flatten(userRolesAndPermissions.map(elem => elem.permissions));
          userScopes = userScopes.map(elem => elem.name);
          // console.log("userScopes", userScopes)
        }
      }

      const auth = {
        isAuthenticated: tokenUser ? true : false,

        scope: userScopes,
        userScopes: userScopes,

        userRolesAndPermissions,
        groupRolesAndPermissions,
        orgRolesAndPermissions
      };

      // console.log('currentUserAuth - graphql context', auth);

      // console.log("Auth - Context - End")
      return {
        Authn,
        user: tokenUser,
        auth,
        SECRET,
        req
      };
    } catch (e) {
      log.error(e);
      throw e;
    }
  },
  middleware: app => {
    app.use(authTokenMiddleware(Authn));
    if (authn.password.sendConfirmationEmail) {
      app.get('/confirmation/:token', confirmAccountHandler);
    }

    if (authn.oauth.enabled === true) {
      OAuth.Enable(app);
    }
  }
});
