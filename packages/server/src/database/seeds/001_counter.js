import { truncateTables } from '../../sql/helpers';

const initialAmount = 5;

export async function seed(knex) {
  await truncateTables(knex, Promise, ['counter']);

  return knex('counter')
    .returning('id')
    .insert({ amount: initialAmount });
}
