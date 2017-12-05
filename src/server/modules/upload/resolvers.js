/*eslint-disable no-unused-vars*/
import shell from 'shelljs';
import fs from 'fs';

import FieldError from '../../../common/FieldError';

export default pubsub => ({
  Query: {
    files(obj, args, { Upload }) {
      return Upload.files();
    }
  },
  Mutation: {
    uploadFiles: async (obj, { files }, { Upload }) => {
      return await Upload.saveFiles(files);
    },
    removeFile: async (obj, { id }, { Upload }) => {
      const e = new FieldError();

      const file = await Upload.file(id);
      if (!file) {
        e.setError('file', 'File not found.');
        e.throwIf();
      }

      const ok = await Upload.deleteFile(id);
      if (ok) {
        const filePath = `${file.path}`;
        const res = shell.rm(filePath);
        if (res.code > 0) {
          e.setError('file', 'Unable to delete file.');
          e.throwIf();
        }
      }
      return ok;
    }
  },
  Subscription: {}
});
