import jwt from './jwt';
import session from './session';

import resolvers from './resolvers';

import schema from './schema.graphql';

import AccessModule from './AccessModule';

// Try to grant access via sessions first, and if that fails, then try using JWT
// This way if both JWT and sessions enabled UI won't have to refresh access tokens
export default new AccessModule(
  {
    createResolversFunc: [resolvers],
    schema: [schema]
  },
  session,
  jwt
);
