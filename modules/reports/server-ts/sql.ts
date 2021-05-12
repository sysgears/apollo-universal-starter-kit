import { Model } from 'objection';

export default class ContactsDAO extends Model {
  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' }
      }
    };
  }

  public static tableName = 'report';

  public getContacts() {
    return ContactsDAO.query();
  }
}
