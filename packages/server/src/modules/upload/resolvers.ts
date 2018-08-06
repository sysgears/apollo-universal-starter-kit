import fs from 'fs';
import mkdirp from 'mkdirp';
import shortid from 'shortid';

const UPLOAD_DIR = 'public';

interface StoreFsProps {
  filename: string;
  stream: any;
}

const storeFS = ({ stream, filename }: StoreFsProps): Promise<{ path: string; size: number }> => {
  // Check if UPLOAD_DIR exists, create one if not
  if (!fs.existsSync(UPLOAD_DIR)) {
    try {
      mkdirp.sync(UPLOAD_DIR);
    } catch (e) {
      throw new Error('Can not create such directory');
    }
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
      .on('finish', () => resolve({ path, size: fs.statSync(path).size }))
  );
};

interface ProcessUploadProps {
  filename: string;
  mimetype: string;
  stream: any;
}

const processUpload = async (uploadPromise: Promise<ProcessUploadProps>) => {
  const { stream, filename, mimetype } = await uploadPromise;
  const { path, size } = await storeFS({ stream, filename });

  return { name: filename, type: mimetype, path, size };
};

export default () => ({
  Query: {
    files(obj: any, args: any, { Upload }: any) {
      return Upload.files();
    }
  },
  Mutation: {
    async uploadFiles(obj: any, { files }: { files: [Promise<ProcessUploadProps>] }, { Upload }: any) {
      const results = await Promise.all(files.map(processUpload));

      return Upload.saveFiles(results);
    },
    async removeFile(obj: {}, { id }: { id: number }, { Upload }: any) {
      const { path } = await Upload.file(id);

      if (!path || !(await Upload.deleteFile(id))) {
        throw new Error('File not found.');
      }

      // remove file
      try {
        fs.unlinkSync(path);
      } catch (e) {
        throw new Error('Unable to delete file.');
      }

      return true;
    }
  },
  Subscription: {}
});
