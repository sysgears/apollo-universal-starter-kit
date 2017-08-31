import bcrypt from 'bcryptjs';
/*
For DB's other than SQLite you'll have to use raw queries for truncation if there is a foreign key constraint in your table.

Instead of
await Promise.all([
  knex('user').truncate()
]);

Use
await Promise.all([
  knex.raw('TRUNCATE TABLE user CASCADE')
]);
*/

export async function seed(knex, Promise) {
  await Promise.all([
    knex('user').truncate()
  ]);

  await Promise.all([
    knex('user').returning('id').insert({ username: 'admin', email: 'admin@example.com', password: await bcrypt.hash('admin', 12), is_admin: true }),
    knex('user').returning('id').insert({ username: 'user', email: 'user@example.com', password: await bcrypt.hash('user', 12) }),
  ]);
}
