import { returnId, truncateTables } from '@gqlapp/database-server-ts';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['$_module$']);

  await returnId(knex('$_module$').insert({ name: 'test' }));
}
