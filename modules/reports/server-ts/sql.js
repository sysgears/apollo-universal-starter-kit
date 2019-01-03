import { knex } from '@module/database-server-ts';

export default class Report {
  posts() {
    return knex('upload').select('*');
  }
}
