import schema from './schema.graphql';
import resolvers from './resolvers';

import jwt from './strategies/jwt'; // eslint-disable-line
// import session from './strategies/session'; // eslint-disable-line

import Feature from '../connector';

export default new Feature(jwt, {
  schema,
  createResolversFunc: resolvers
});
