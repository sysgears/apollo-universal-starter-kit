import { GraphQLModule } from '@gqlapp/graphql-server-ts';
import Report from '../sql';
import schema from './schema.graphql';
import resolvers from './resolvers';
import resources from './locales';

export default new GraphQLModule({
  schema: [schema],
  createResolversFunc: [resolvers],
  createContextFunc: [() => ({ Report: new Report() })],
  localization: [{ ns: 'PdfReport', resources }]
});
