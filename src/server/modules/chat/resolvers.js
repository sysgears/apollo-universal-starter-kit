import { withFilter } from 'graphql-subscriptions';

const CHAT_SUBSCRIPTION = 'chat_subscription';
const CHATS_SUBSCRIPTION = 'chats_subscription';
const MESSAGE_SUBSCRIPTION = 'message_subscription';

export default pubsub => ({
  Query: {
    async chats(obj, { limit, after }, context) {
      let edgesArray = [];
      let chats = await context.Chat.chatsPagination(limit, after);

      chats.map(chat => {
        edgesArray.push({
          cursor: chat.id,
          node: {
            id: chat.id,
            title: chat.title,
            content: chat.content
          }
        });
      });

      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;

      const values = await Promise.all([context.Chat.getTotal(), context.Chat.getNextPageFlag(endCursor)]);

      return {
        totalCount: values[0].count,
        edges: edgesArray,
        pageInfo: {
          endCursor: endCursor,
          hasNextPage: values[1].count > 0
        }
      };
    },
    chat(obj, { id }, context) {
      return context.Chat.chat(id);
    }
  },
  Chat: {
    messages({ id }, args, context) {
      return context.loaders.getMessagesForChatIds.load(id);
    }
  },
  Mutation: {
    async addChat(obj, { input }, context) {
      const [id] = await context.Chat.addChat(input);
      const chat = await context.Chat.chat(id);
      // publish for chat list
      pubsub.publish(CHATS_SUBSCRIPTION, {
        chatsUpdated: {
          mutation: 'CREATED',
          id,
          node: chat
        }
      });
      return chat;
    },
    async deleteChat(obj, { id }, context) {
      const chat = await context.Chat.chat(id);
      const isDeleted = await context.Chat.deleteChat(id);
      if (isDeleted) {
        // publish for chat list
        pubsub.publish(CHATS_SUBSCRIPTION, {
          chatsUpdated: {
            mutation: 'DELETED',
            id,
            node: chat
          }
        });
        return { id: chat.id };
      } else {
        return { id: null };
      }
    },
    async editChat(obj, { input }, context) {
      await context.Chat.editChat(input);
      const chat = await context.Chat.chat(input.id);
      // publish for chat list
      pubsub.publish(CHATS_SUBSCRIPTION, {
        chatsUpdated: {
          mutation: 'UPDATED',
          id: chat.id,
          node: chat
        }
      });
      // publish for edit chat page
      pubsub.publish(CHAT_SUBSCRIPTION, { chatUpdated: chat });
      return chat;
    },
    async addMessage(obj, { input }, context) {
      const [id] = await context.Chat.addMessage(input);
      const message = await context.Chat.getMessage(id);
      // publish for edit chat page
      pubsub.publish(MESSAGE_SUBSCRIPTION, {
        messageUpdated: {
          mutation: 'CREATED',
          id: message.id,
          chatId: input.chatId,
          node: message
        }
      });
      return message;
    },
    async deleteMessage(obj, { input: { id, chatId } }, context) {
      await context.Chat.deleteMessage(id);
      // publish for edit chat page
      pubsub.publish(MESSAGE_SUBSCRIPTION, {
        messageUpdated: {
          mutation: 'DELETED',
          id,
          chatId,
          node: null
        }
      });
      return { id };
    },
    async editMessage(obj, { input }, context) {
      await context.Chat.editMessage(input);
      const message = await context.Chat.getMessage(input.id);
      // publish for edit chat page
      pubsub.publish(MESSAGE_SUBSCRIPTION, {
        messageUpdated: {
          mutation: 'UPDATED',
          id: input.id,
          chatId: input.chatId,
          node: message
        }
      });
      return message;
    }
  },
  Subscription: {
    chatUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(CHAT_SUBSCRIPTION),
        (payload, variables) => {
          return payload.chatUpdated.id === variables.id;
        }
      )
    },
    chatsUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(CHATS_SUBSCRIPTION),
        (payload, variables) => {
          return variables.endCursor <= payload.chatsUpdated.id;
        }
      )
    },
    messageUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_SUBSCRIPTION),
        (payload, variables) => {
          return payload.messageUpdated.chatId === variables.chatId;
        }
      )
    }
  }
});
