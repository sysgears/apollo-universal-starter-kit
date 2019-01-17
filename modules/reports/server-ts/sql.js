import { knex } from '@module/database-server-ts';

export default class Report {
  report() {
    return knex
      .select('id', 'name', 'phone', 'email')
      .from('report')
      .orderBy('id', 'desc');
  }
}
