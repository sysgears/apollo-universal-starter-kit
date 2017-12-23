// Components
import schema from './schema.graphql';
import createResolvers from './resolvers';
import Plugin from '../connector';

export default new Plugin({ schema, createResolversFunc: createResolvers });
