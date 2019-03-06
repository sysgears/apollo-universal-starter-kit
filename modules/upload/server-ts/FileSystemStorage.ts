import fs, { Stats } from 'fs';
import mkdirp from 'mkdirp';
import shortid from 'shortid';

export interface UploadedFile {
  path: string;
  name: string;
  size: number;
  type: string;
}

export interface UploadFileStream {
  stream: any;
  filename: string;
  mimetype: string;
}

/**
 * Class FileSystemStorage provides saving, getting info, deleting the files in the file system.
 */
export class FileSystemStorage {
  public save(uploadFileStream: UploadFileStream, location: string, shouldGenerateId = true): Promise<UploadedFile> {
    const { stream, filename, mimetype } = uploadFileStream;
    const id = shouldGenerateId ? `${shortid.generate()}-` : '';
    const sanitizedFilename = filename.replace(/[^a-z0-9_.\-]/gi, '_').toLowerCase();
    const path = `${location}/${id}${sanitizedFilename}`;

    // Check if UPLOAD_DIR exists, create one if not
    if (!fs.existsSync(location)) {
      mkdirp.sync(location);
    }

    return new Promise((resolve, reject) =>
      stream
        .on('error', async (error: Error) => {
          if (stream.truncated) {
            // Delete the truncated file
            await this.delete(path);
          }

          reject(error);
        })
        .pipe(fs.createWriteStream(path))
        .on('error', (error: Error) => reject(error))
        .on('finish', async () => {
          const { size } = await this.getInfo(path);
          resolve({ path, size, name: filename, type: mimetype });
        })
    );
  }

  public delete(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, err => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }

  public getInfo(filePath: string): Promise<Stats> {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          reject(err);
        }

        resolve(stats);
      });
    });
  }
}

export default new FileSystemStorage();
