/*eslint-disable no-unused-vars*/
import { GraphQLUpload } from 'apollo-upload-server';
import shell from 'shelljs';
import fs from 'fs';
import mkdirp from 'mkdirp';
import shortid from 'shortid';

import FieldError from '../../../../common/FieldError';

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
      .on('error', error => reject(error))
      .on('finish', () => resolve({ id, path, size: fs.statSync(path).size }))
  );
};

const processUpload = async uploadPromise => {
  const { stream, filename, mimetype, encoding } = await uploadPromise;
  const { id, path, size } = await storeFS({ stream, filename });
  return { name: filename, type: mimetype, path, size };
};

export default pubsub => ({
  Query: {
    files(obj, args, { Upload }) {
      return Upload.files();
    }
  },
  Mutation: {
    uploadFiles: async (obj, { files }, { Upload }) => {
      const results = await Promise.all(files.map(processUpload));
      return Upload.saveFiles(results);
    },
    removeFile: async (obj, { id }, { Upload }) => {
      const file = await Upload.file(id);
      if (!file) {
        throw new Error('File not found.');
      }

      const ok = await Upload.deleteFile(id);
      if (ok) {
        const filePath = `${file.path}`;
        const res = shell.rm(filePath);
        if (res.code > 0) {
          throw new Error('Unable to delete file.');
        }
      }
      return ok;
    }
  },
  Subscription: {},
  Upload: GraphQLUpload
});
