import { knex } from '@gqlapp/database-server-ts';

export default class Report {
  public report() {
    return knex
      .select('id', 'name', 'phone', 'email')
      .from('report')
      .orderBy('id', 'asc');
  }
}
