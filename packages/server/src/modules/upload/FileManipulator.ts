import fs from 'fs';
import mkdirp from 'mkdirp';
import shortid from 'shortid';

export interface FileData {
  name: string;
  type: string;
  path: string;
  size: number;
}

export interface FileProcessData {
  stream: any;
  filename: string;
  mimetype: string;
}

/**
 * Class FileManipulator provides works (saving, removing, getting info) with files in the file system.
 */
class FileManipulator {
  public saveFileToFs(FileProcess: FileProcessData, uploadDir: string, generateId = true): Promise<FileData> {
    const { stream, filename, mimetype } = FileProcess;
    const id = generateId ? `${shortid.generate()}-` : '';
    const path = `${uploadDir}/${id}${filename}`;

    // Check if UPLOAD_DIR exists, create one if not
    if (!fs.existsSync(uploadDir)) {
      mkdirp.sync(uploadDir);
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
        .on('finish', () => resolve({ path, size: fs.statSync(path).size, name: filename, type: mimetype }))
    );
  }

  public removeFileFromFs = (filePath: string) => {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, err => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  };

  public getFileInfo = (filePath: string) => {
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

export default new FileManipulator();
