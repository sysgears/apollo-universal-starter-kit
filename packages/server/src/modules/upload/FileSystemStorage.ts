import fs from 'fs';
import mkdirp from 'mkdirp';
import shortid from 'shortid';

export interface SavedFileInfo {
  path: string;
  name: string;
  size: number;
  type: string;
}

export interface FileUploadProcess {
  stream: any;
  filename: string;
  mimetype: string;
}

/**
 * Class FileSystemStorage provides works (saving, delete, getting info) with files in the file system.
 */
class FileSystemStorage {
  public save(fileUploadProcess: FileUploadProcess, location: string, shouldGenerateId = true): Promise<SavedFileInfo> {
    const { stream, filename, mimetype } = fileUploadProcess;
    const id = shouldGenerateId ? `${shortid.generate()}-` : '';
    const path = `${location}/${id}${filename}`;

    // Check if UPLOAD_DIR exists, create one if not
    if (!fs.existsSync(location)) {
      mkdirp.sync(location);
    }

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
        .on('finish', () => resolve({ path, name: filename, size: fs.statSync(path).size, type: mimetype }))
    );
  }

  public delete = (filePath: string) => {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, err => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  };

  public getInfo = (filePath: string) => {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          reject(err);
        }

        resolve(stats);
      });
    });
  };
}

export default new FileSystemStorage();
