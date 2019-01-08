import { knex } from '@module/database-server-ts';

export default class Report {
  report(id) {
    return knex
      .select('id', 'name', 'phone', 'email')
      .from('report')
      .where('id', '=', id)
      .first();
  }

  reports() {
    return knex
      .select('id', 'name', 'phone', 'email')
      .from('report')
      .orderBy('id', 'desc');
  }
}
