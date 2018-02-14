import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['$_module$']);

  await knex('$_module$')
    .returning('id')
    .insert({ name: 'test' });
}
