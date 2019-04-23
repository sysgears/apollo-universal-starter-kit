import knex from '../../../packages/server/src/sql/connector';
import { Model } from 'objection';

// Give the knex instance to objection.
Model.knex(knex);

// Counter model.
export default class Counter extends Model {
  static get tableName() {
    return 'counter';
  }

  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        amount: { type: 'integer' }
      }
    };
  }

  public counterQuery() {
    return Counter.query().first();
  }

  public addCounter(amount: number) {
    return Counter.query().increment('amount', amount);
  }
}
