import { Model } from 'objection';

// Counter model.
export default class Counter extends Model {
  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        amount: { type: 'integer' }
      }
    };
  }

  // Table name is the only required property.
  public static tableName = 'counter';
  public id!: number;
  public amount!: number;

  public counterQuery() {
    return Counter.query().first();
  }

  public addCounter(amount: number) {
    return Counter.query().increment('amount', amount);
  }
}
