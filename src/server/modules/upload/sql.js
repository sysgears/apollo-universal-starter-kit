/*eslint-disable no-unused-vars*/
import knex from '../../../server/sql/connector';

export default class Upload {
  files() {
    return knex('upload').select('*');
  }

  saveFile(file) {
    return knex('upload').insert(file);
  }
}
