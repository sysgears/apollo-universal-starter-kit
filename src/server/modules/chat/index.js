import DataLoader from 'dataloader';

import Chat from './sql';
import schema from './schema.graphqls';
import createResolvers from './resolvers';

import Feature from '../connector';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    const chat = new Chat();

    return {
      Chat: chat,
      loaders: {
        getMessagesForChatIds: new DataLoader(chat.getMessagesForChatIds)
      }
    };
  }
});
