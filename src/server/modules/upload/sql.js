/*eslint-disable no-unused-vars*/
import knex from '../../../server/sql/connector';

export default class Upload {
  files() {
    return knex('upload').select('*');
  }

  file(id) {
    return knex('upload')
      .select('*')
      .where({ id })
      .first();
  }

  saveFile(file) {
    return knex('upload').insert(file);
  }

  deleteFile(id) {
    return knex('upload')
      .where({ id })
      .del();
  }
}
