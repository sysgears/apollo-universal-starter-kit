import fs from 'fs';
import mkdirp from 'mkdirp';
import shell from 'shelljs';
import { createBatchResolver } from 'graphql-resolve-batch';

const MESSAGE_SUBSCRIPTION = 'message_subscription';
const MESSAGES_SUBSCRIPTION = 'messages_subscription';
const UPLOAD_DIR = 'public';

const storeFS = ({ stream, filename }) => {
  // Check if UPLOAD_DIR exists, create one if not
  if (!fs.existsSync(UPLOAD_DIR)) {
    mkdirp(UPLOAD_DIR, err => {
      if (err) throw new Error(err);
    });
  }

  const path = `${UPLOAD_DIR}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated) {
          // Delete the truncated file
          fs.unlinkSync(path);
        }
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => {
        return reject(error);
      })
      .on('finish', () => resolve({ path, size: fs.statSync(path).size }))
  );
};

const processUpload = async uploadPromise => {
  const { stream, filename, mimetype } = await uploadPromise;
  const { path, size } = await storeFS({ stream, filename });
  return { name: filename, type: mimetype, path, size };
};

export default pubsub => ({
  Query: {
    async messages(obj, { limit, after }, { Chat }) {
      const edgesArray = [];
      const messages = await Chat.messagesPagination(limit, after);

      messages.map((message, index) => {
        edgesArray.push({
          cursor: after + index,
          node: message
        });
      });

      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;
      const total = (await Chat.getTotal()).count;
      const hasNextPage = total > after + limit;

      return {
        totalCount: total,
        edges: edgesArray.reverse(),
        pageInfo: {
          endCursor: endCursor,
          hasNextPage: hasNextPage
        }
      };
    },
    message(obj, { id }, { Chat }) {
      return Chat.message(id);
    }
  },
  Message: {
    replyMessage: createBatchResolver((sources, args, context) => {
      return context.Chat.getQuatedMessages(sources.map(({ reply }) => reply));
    })
  },
  Mutation: {
    async addMessage(obj, { input }, context) {
      const { Chat, user } = context;
      const { attachment = null } = input;
      const userId = user ? user.id : null;
      const results = attachment ? await processUpload(attachment) : null;
      const data = { ...input, attachment: results, userId };
      const [id] = attachment ? await Chat.addMessageWithAttachment(data) : await Chat.addMessage(data);
      const message = await Chat.message(id);
      // publish for message list
      pubsub.publish(MESSAGES_SUBSCRIPTION, {
        messagesUpdated: {
          mutation: 'CREATED',
          id,
          node: message
        }
      });
      return message;
    },
    async deleteMessage(obj, { id }, { Chat }) {
      const message = await Chat.message(id);
      const attachment = await Chat.attachment(id);
      const isDeleted = await Chat.deleteMessage(id);

      if (isDeleted && attachment) {
        const attachmentPath = `${attachment.path}`;
        const res = shell.rm(attachmentPath);
        if (res.code > 0) {
          throw new Error('Unable to delete attachment.');
        }
      }

      if (isDeleted) {
        // publish for message list
        pubsub.publish(MESSAGES_SUBSCRIPTION, {
          messagesUpdated: {
            mutation: 'DELETED',
            id,
            node: message
          }
        });
        return { id: message.id };
      } else {
        return { id: null };
      }
    },
    async editMessage(obj, { input }, { Chat }) {
      await Chat.editMessage(input);
      const message = await Chat.message(input.id);
      // publish for post list
      pubsub.publish(MESSAGES_SUBSCRIPTION, {
        messagesUpdated: {
          mutation: 'UPDATED',
          id: message.id,
          node: message
        }
      });

      // publish for edit post page
      pubsub.publish(MESSAGE_SUBSCRIPTION, { messagesUpdated: message });
      return message;
    }
  },
  Subscription: {
    messagesUpdated: {
      subscribe: () => pubsub.asyncIterator(MESSAGES_SUBSCRIPTION)
    }
  }
});
