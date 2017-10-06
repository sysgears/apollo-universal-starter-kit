import bcrypt from 'bcryptjs';
/*
For DB's other than SQLite you'll have to use raw queries for truncation if there is a foreign key constraint in your table.

Instead of
await Promise.all([
  knex('user').truncate(),
  knex('auth_local').truncate(),
  knex('auth_certificate').truncate(),
  knex('auth_facebook').truncate()
]);

Use
await Promise.all([
  knex.raw('ALTER SEQUENCE user_id_seq RESTART WITH 1'),
  knex.raw('TRUNCATE TABLE user CASCADE')
  knex.raw('TRUNCATE TABLE auth_local CASCADE')
  knex.raw('TRUNCATE TABLE auth_certificate CASCADE')
  knex.raw('TRUNCATE TABLE auth_facebook CASCADE')
]);
*/

export async function seed(knex, Promise) {
  await Promise.all([
    knex('user').truncate(),
    knex('auth_local').truncate(),
    knex('auth_certificate').truncate(),
    knex('auth_facebook').truncate()
  ]);

  const [adminId] = await knex('user')
    .returning('id')
    .insert({ username: 'admin', is_active: true, is_admin: true });
  await knex('auth_local')
    .returning('id')
    .insert({
      email: 'admin@example.com',
      password: await bcrypt.hash('admin', 12),
      user_id: adminId
    });
  await knex('auth_certificate')
    .returning('id')
    .insert({
      serial: '00',
      user_id: adminId
    });

  const [userId] = await knex('user')
    .returning('id')
    .insert({ username: 'user', is_active: true, is_admin: false });
  await knex('auth_local')
    .returning('id')
    .insert({
      email: 'user@example.com',
      password: await bcrypt.hash('user', 12),
      user_id: userId
    });
  await knex('auth_certificate')
    .returning('id')
    .insert({
      serial: '01',
      user_id: userId
    });
}
