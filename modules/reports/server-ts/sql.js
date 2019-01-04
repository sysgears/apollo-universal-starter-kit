import { knex } from '@module/database-server-ts';

export default class Report {
  report(id) {
    return knex
      .select('id', 'title', 'content')
      .from('report')
      .where('id', '=', id)
      .first();
  }
}
