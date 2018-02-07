import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['customer']);

  await knex('customer')
    .returning('id')
    .insert({ name: 'test' });
}
