import fs from 'fs';
import mkdirp from 'mkdirp';
import shortid from 'shortid';

import settings from '../../../../../settings';

const UPLOAD_DIR = settings.upload.uploadDir;

interface FileProcessData {
  stream: any;
  filename: string;
  mimetype: string;
}

interface FileData {
  name: string;
  type: string;
  path: string;
  size: number;
}

const storeFS = ({ stream, filename, mimetype }: FileProcessData): Promise<FileData> => {
  // Check if UPLOAD_DIR exists, create one if not
  if (!fs.existsSync(UPLOAD_DIR)) {
    mkdirp.sync(UPLOAD_DIR);
  }

  const id = shortid.generate();
  const path = `${UPLOAD_DIR}/${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .on('error', (error: Error) => {
        if (stream.truncated) {
          // Delete the truncated file
          fs.unlinkSync(path);
        }
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('error', (error: Error) => reject(error))
      .on('finish', () => resolve({ path, size: fs.statSync(path).size, name: filename, type: mimetype }))
  );
};

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
        const filesData = await Promise.all(files.map(async uploadPromise => storeFS(await uploadPromise)));

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
        fs.unlinkSync(file.path);
      } catch (e) {
        throw new Error(t('upload:fileNotDeleted'));
      }

      return true;
    }
  },
  Subscription: {}
});
