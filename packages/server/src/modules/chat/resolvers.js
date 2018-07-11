import { GraphQLUpload } from 'apollo-upload-server';
import fs from 'fs';
import shortid from 'shortid';
import mkdirp from 'mkdirp';

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

  const id = shortid.generate();
  const path = `${UPLOAD_DIR}/${id}-${filename}`;
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
      .on('finish', () => resolve({ id, path, size: fs.statSync(path).size }))
  );
};

const processUpload = async uploadPromise => {
  const { stream, filename, mimetype } = await uploadPromise;
  const { path, size } = await storeFS({ stream, filename });
  return { name: filename, type: mimetype, path, size };
};

export default pubsub => ({
  Query: {
    messages(obj, args, context) {
      return context.Chat.getMessages();
    },
    message(obj, { id }, context) {
      return context.Chat.message(id);
    }
  },
  Mutation: {
    async uploadImage(obj, { image }, { Upload }) {
      const results = await processUpload(image);
      return Upload.saveFiles(results);
    },
    async addMessage(obj, { input }, context) {
      const { attachment = null } = input;
      const userId = context.user ? context.user.id : null;
      const results = attachment ? await processUpload(attachment) : null;
      const data = { ...input, attachment: results, userId };
      const [id] = attachment ? await context.Chat.addMessageWithAttachment(data) : await context.Chat.addMessage(data);
      const message = await context.Chat.message(id);
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
    async deleteMessage(obj, { id }, context) {
      const message = await context.Chat.message(id);
      const isDeleted = await context.Chat.deleteMessage(id);
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
    async editMessage(obj, { input }, context) {
      await context.Chat.editMessage(input);
      const message = await context.Chat.message(input.id);
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
  },
  UploadAttachment: GraphQLUpload
});
