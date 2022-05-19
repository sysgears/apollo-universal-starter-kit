import ServerModule from '@gqlapp/module-server-ts';
import schema from './schema.graphql';
import createResolvers from './resolvers';

export default new ServerModule({ schema: [schema], createResolversFunc: [createResolvers] });
