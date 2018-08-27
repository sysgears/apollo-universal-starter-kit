import fileSystemStorage, { FileUploadProcess } from './FileSystemStorage';
import settings from '../../../../../settings';

interface FileUploadProcesses {
  files: [Promise<FileUploadProcess>];
}

export default () => ({
  Query: {
    files(obj: any, args: any, { Upload }: any) {
      return Upload.files();
    }
  },
  Mutation: {
    async uploadFiles(obj: any, { files }: FileUploadProcesses, { Upload, req }: any) {
      const { t } = req;

      try {
        // load files to fs
        const filesInfo = await Promise.all(
          files.map(async uploadPromise => fileSystemStorage.save(await uploadPromise, settings.upload.uploadDir))
        );

        // save files data into DB
        return Upload.saveFiles(filesInfo);
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
