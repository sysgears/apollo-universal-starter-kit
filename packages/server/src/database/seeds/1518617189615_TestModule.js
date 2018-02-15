import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['test_module']);

  await knex('test_module')
    .returning('id')
    .insert({ name: 'test' });
}
