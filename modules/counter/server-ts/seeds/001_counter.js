import { returnId, truncateTables } from '@module/database-server-ts';

const initialAmount = 5;

export async function seed(knex) {
  await truncateTables(knex, Promise, ['counter']);

  return returnId(knex('counter')).insert({ amount: initialAmount });
}
