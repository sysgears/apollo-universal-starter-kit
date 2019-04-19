import { GraphQLServerModule } from '@gqlapp/graphql-server-ts';
import Report from '../sql';
import schema from './schema.graphql';
import resolvers from './resolvers';

export default new GraphQLServerModule({
  schema: [schema],
  createResolversFunc: [resolvers],
  createContextFunc: [() => ({ Report: new Report() })]
});
