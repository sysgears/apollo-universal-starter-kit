import { returnId, truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['$_module$']);

  await returnId(knex('$_module$').insert({ name: 'test' }));
}
