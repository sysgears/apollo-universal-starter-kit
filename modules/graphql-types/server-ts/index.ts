import schema from './schema.graphql';
import createResolvers from './resolvers';
import ServerModule from '@gqlapp/module-server-ts';

export default new ServerModule({ schema: [schema], createResolversFunc: [createResolvers] });
