import { createBatchResolver } from 'graphql-resolve-batch';
import { PubSub } from 'graphql-subscriptions';
import { TranslationFunction } from 'i18next';
import ServerModule from '@module/module-server-ts';
import { FileSystemStorage, UploadFileStream } from '@module/upload-server-ts';

import settings from '../../../settings';
import ChatDAO, { Message, Identifier } from './sql';

const MESSAGES_SUBSCRIPTION = 'messages_subscription';

interface ChatContext {
  Chat: ChatDAO;
  req?: Request & { t: TranslationFunction };
  user?: any; // TODO: Add user type after converting the UserDAO into TS
}

interface AddMessageParams {
  input: {
    text: string;
    userId: number;
    uuid: string;
    quotedId: number;
    attachment: UploadFileStream;
  };
}

interface EditMessageParams {
  input: {
    id: number;
    text: string;
    userId: number;
  };
}

const ref: { modules: ServerModule } = { modules: null };

export const onAppCreate = (modules: ServerModule) => (ref.modules = modules);

export default (pubsub: PubSub) => ({
  Query: {
    async messages(obj: any, { limit, after }: { limit: number; after: number }, { Chat }: ChatContext) {
      const edgesArray: Array<{ cursor: number; node: Message }> = [];
      const messages = await Chat.messagesPagination(limit, after);

      messages.map((message: Message, index: number) => {
        edgesArray.push({ cursor: after + index, node: message });
      });

      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;
      const total = (await Chat.getTotal()).count;
      const hasNextPage = total > after + limit;

      return {
        totalCount: total,
        edges: edgesArray.reverse(),
        pageInfo: {
          endCursor,
          hasNextPage
        }
      };
    },
    message(obj: any, { id }: Identifier, { Chat }: ChatContext) {
      return Chat.message(id);
    }
  },
  Message: {
    quotedMessage: createBatchResolver((sources, args, context) => {
      return context.Chat.getQuatedMessages(sources.map(({ quotedId }) => quotedId));
    })
  },
  Mutation: {
    async addMessage(obj: any, { input }: AddMessageParams, { Chat, user, req }: ChatContext) {
      const { t } = req;
      const { attachment } = input;
      const userId = user ? user.id : null;
      const fileSystemStorage: FileSystemStorage = ref.modules.data.fileSystemStorage;

      if (!fileSystemStorage) {
        throw new Error(t('chat:messageNotAdded'));
      }

      const result = attachment ? await fileSystemStorage.save(await attachment, settings.chat.uploadDir) : null;
      const data = { ...input, attachment: result, userId };
      const [id] = attachment ? await Chat.addMessageWithAttachment(data) : await Chat.addMessage(data);
      const message = await Chat.message(id);
      // publish for message list
      pubsub.publish(MESSAGES_SUBSCRIPTION, { messagesUpdated: { mutation: 'CREATED', id, node: message } });
      return message;
    },
    async deleteMessage(obj: any, { id }: Identifier, { Chat, req }: ChatContext) {
      const { t } = req;
      const fileSystemStorage: FileSystemStorage = ref.modules.data.fileSystemStorage;
      const message = await Chat.message(id);
      const attachment = await Chat.attachment(id);
      const isDeleted = await Chat.deleteMessage(id);

      if (isDeleted && attachment && fileSystemStorage) {
        // remove file
        try {
          await fileSystemStorage.delete(attachment.path);
        } catch (e) {
          throw new Error(t('chat:fileNotDeleted'));
        }
      }

      if (isDeleted) {
        // publish for message list
        pubsub.publish(MESSAGES_SUBSCRIPTION, { messagesUpdated: { mutation: 'DELETED', id, node: message } });
        return { id: message.id };
      } else {
        return { id: null };
      }
    },
    async editMessage(obj: any, { input }: EditMessageParams, { Chat }: ChatContext) {
      await Chat.editMessage(input);
      const message = await Chat.message(input.id);
      // publish for post list
      pubsub.publish(MESSAGES_SUBSCRIPTION, {
        messagesUpdated: { mutation: 'UPDATED', id: message.id, node: message }
      });
      return message;
    }
  },
  Subscription: {
    messagesUpdated: {
      subscribe: () => pubsub.asyncIterator(MESSAGES_SUBSCRIPTION)
    }
  }
});
