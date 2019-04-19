import Chat from './sql';

import schema from './schema.graphql';
import createResolvers, { onAppCreate } from './resolvers';
import { GraphQLServerModule } from '@gqlapp/graphql-server-ts';
import resources from './locales';

export default new GraphQLServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Chat: new Chat() })],
  localization: [{ ns: 'chat', resources }],
  onAppCreate: [onAppCreate]
});
