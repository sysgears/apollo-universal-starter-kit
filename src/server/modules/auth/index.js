import DataLoader from 'dataloader';

import schema from './schema.graphqls';
import createResolvers from './resolvers';
import Feature from '../connector';

import { confirmAccountHandler } from './flow/confirm';
import authTokenMiddleware from './middleware/token';

import OAuth from './oauth';
import parseUser from './flow/parseUser';

import settings from '../../../../settings';
import log from '../../../common/log';

import AuthDAO from './lib';
import AuthzDAO from './authz/lib';

import AuthnFeature from './authn';
import AuthzFeature from './authz';

const subFeatures = [AuthnFeature, AuthzFeature];

const SECRET = settings.auth.secret;
const entities = settings.entities;
const authn = settings.auth.authentication;

export default new Feature(
  {
    schema,
    createResolversFunc: createResolvers,
    createContextFunc: async (req, connectionParams, webSocket) => {
      try {
        const Auth = new AuthDAO();
        const Authz = new AuthzDAO();

        const loaders = {
          getRolesForOrgs: new DataLoader(Auth.getRolesForOrgs),
          getRolesForGroups: new DataLoader(Auth.getRolesForGroups)
        };

        let userScopes = [];
        let allRoles = {};

        const tokenUser = await parseUser({ req, connectionParams, webSocket });
        console.log('Auth - Context - tokenUser', tokenUser);

        if (tokenUser) {
          // TODO replace the following with a call to replace static scope lookup with a dynamic one
          // // ALSO, make this configurable, static or dynamic role/permission sets

          if (entities.orgs.enabled) {
            allRoles = await Authz.getAllRolesForUser(tokenUser.id);
            // console.log("Auth - Context - allRoles", allRoles)

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

        // console.log("Auth - Context - End")
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
  },
  ...subFeatures
);
