import { GraphQLModule } from '@gqlapp/graphql-server-ts';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';

export default new GraphQLModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  localization: [{ ns: 'contact', resources }]
});
