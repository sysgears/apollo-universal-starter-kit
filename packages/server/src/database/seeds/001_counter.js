import { returnId, truncateTables } from '../../sql/helpers';

const initialAmount = 5;

export async function seed(knex) {
  await truncateTables(knex, Promise, ['counter']);

  return returnId(knex('counter')).insert({ amount: initialAmount });
}
