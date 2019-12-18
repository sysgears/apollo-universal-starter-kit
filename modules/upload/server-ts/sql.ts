import { Model } from 'objection';

interface File {
  name: string;
  type: string;
  path: string;
  size: number;
}

// Upload model.
export default class Upload extends Model {
  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        type: { type: 'string' },
        path: { type: 'string' },
        size: { type: 'integer' }
      }
    };
  }

  public static tableName = 'upload';

  public files() {
    return Upload.query();
  }

  public file(id: number) {
    return Upload.query().findById(id);
  }

  public saveFiles(files: [File]) {
    return Upload.query().insertGraph(files);
  }

  public deleteFile(id: number) {
    return Upload.query().deleteById(id);
  }
}
