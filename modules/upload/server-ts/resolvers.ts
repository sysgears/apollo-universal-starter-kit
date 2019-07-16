import settings from '@gqlapp/config';

import fileSystemStorage, { UploadFileStream } from './FileSystemStorage';

interface UploadFileStreams {
  files: [Promise<UploadFileStream>];
}

export default () => ({
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

        // save files data into DB
        await Upload.saveFiles(uploadedFiles);
        return true;
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

      return true;
    }
  },
  Subscription: {}
});
