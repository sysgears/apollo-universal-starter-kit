import Chat from './sql';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Feature from '../connector';
import resources from './locales';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => ({ Chat: new Chat() }),
  localization: { ns: 'chat', resources }
});
