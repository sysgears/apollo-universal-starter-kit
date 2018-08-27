import FileManipulator, { FileProcessData } from './FileManipulator';
import settings from '../../../../../settings';

interface FileProcessProps {
  files: [Promise<FileProcessData>];
}

export default () => ({
  Query: {
    files(obj: any, args: any, { Upload }: any) {
      return Upload.files();
    }
  },
  Mutation: {
    async uploadFiles(obj: any, { files }: FileProcessProps, { Upload, req }: any) {
      const { t } = req;

      try {
        // load files to fs
        const filesData = await Promise.all(
          files.map(async uploadPromise => FileManipulator.saveFileToFs(await uploadPromise, settings.upload.uploadDir))
        );

        // save files data into DB
        return Upload.saveFiles(filesData);
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
        await FileManipulator.removeFileFromFs(file.path);
      } catch (e) {
        throw new Error(t('upload:fileNotDeleted'));
      }

      return true;
    }
  },
  Subscription: {}
});
