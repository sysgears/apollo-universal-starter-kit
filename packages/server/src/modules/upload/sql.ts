import knex from '../../sql/connector';

interface File {
  name: string;
  type: string;
  path: string;
  size: number;
}

export default class Upload {
  public files() {
    return knex('upload').select('*');
  }

  public file(id: number) {
    return knex('upload')
      .select('*')
      .where({ id })
      .first();
  }

  public saveFiles(files: [File]) {
    return knex('upload').insert(files);
  }

  public deleteFile(id: number) {
    return knex('upload')
      .where({ id })
      .del();
  }
}
