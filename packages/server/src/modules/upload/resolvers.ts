import fileSystemStorage from './FileSystemStorage';
import settings from '../../../../../settings';
import * as models from '../../../typings/graphql';
import IUpload from './sql';

interface Context {
  Upload: IUpload;
  req: any;
}

export default (): {
  Query: models.QueryResolvers.Resolvers<Context>;
  Mutation: models.MutationResolvers.Resolvers<Context>;
} => ({
  Query: {
    async files(obj, args, { Upload }) {
      return Upload.files();
    }
  },
  Mutation: {
    async uploadFiles(obj, { files }, { Upload, req }) {
      const { t } = req;

      try {
        // load files to fs
        const uploadedFiles = await Promise.all(
          files.map(async uploadPromise => fileSystemStorage.save(await uploadPromise, settings.upload.uploadDir))
        );

        // save files data into DB
        return Upload.saveFiles(uploadedFiles);
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
  }
});
