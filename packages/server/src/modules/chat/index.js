import Chat from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import ServerModule from '../ServerModule';
import resources from './locales';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Chat: new Chat() })],
  localization: [{ ns: 'chat', resources }]
});
