import fileSystemStorage, { UploadFileStream } from './FileSystemStorage';
import settings from '../../../settings';
import { PubSub } from 'graphql-subscriptions';

const FILES_SUBSCRIPTION = 'files_subscription';

interface UploadFileStreams {
  files: [Promise<UploadFileStream>];
}

export default (pubsub: PubSub) => ({
  Query: {
    files(obj: any, args: any, { Upload }: any) {
      return Upload.files();
    }
  },
  Mutation: {
    async uploadFiles(obj: any, { files }: UploadFileStreams, { Upload, req }: any) {
      const { t } = req;

      try {
        // load files to fs
        const uploadedFiles = await Promise.all(
          files.map(async uploadPromise => fileSystemStorage.save(await uploadPromise, settings.upload.uploadDir))
        );

        const ids = (await Promise.all(uploadedFiles.map(file => Upload.saveFiles(file)))).map(([id]) => id);
        // publish for files list
        pubsub.publish(FILES_SUBSCRIPTION, {
          filesUpdated: { mutation: 'CREATED', files: await Upload.getFilesByIds(ids) }
        });

        return ids;
      } catch (e) {
        throw new Error(t('upload:fileNotLoaded'));
      }
    },
    async removeFile(obj: {}, { id }: { id: number }, { Upload, req }: any) {
      const file = await Upload.file(id);
      const { t } = req;

      if (!file || !(await Upload.deleteFile(id))) {
        throw new Error(t('upload:fileNotFound'));
      }

      // remove file
      try {
        await fileSystemStorage.delete(file.path);
      } catch (e) {
        throw new Error(t('upload:fileNotDeleted'));
      }

      pubsub.publish(FILES_SUBSCRIPTION, { filesUpdated: { mutation: 'DELETED', files: [file] } });
      return true;
    }
  },
  Subscription: {
    filesUpdated: {
      subscribe: () => pubsub.asyncIterator(FILES_SUBSCRIPTION)
    }
  }
});
