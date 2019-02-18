import { knex } from '@gqlapp/database-server-ts';

export default class ContactsDAO {
  public getContacts() {
    return knex
      .select('id', 'name', 'phone', 'email')
      .from('report')
      .orderBy('id', 'asc');
  }
}
