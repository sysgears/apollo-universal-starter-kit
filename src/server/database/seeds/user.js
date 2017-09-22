import bcrypt from 'bcryptjs';
/*
For DB's other than SQLite you'll have to use raw queries for truncation if there is a foreign key constraint in your table.

Instead of
await Promise.all([
  knex('user').truncate(),
  knex('local_auth').truncate()
]);

Use
await Promise.all([
  knex.raw('ALTER SEQUENCE user_id_seq RESTART WITH 1'),
  knex.raw('TRUNCATE TABLE user CASCADE')
  knex.raw('TRUNCATE TABLE local_auth CASCADE')
  knex.raw('TRUNCATE TABLE cert_auth CASCADE')
]);
*/

export async function seed(knex, Promise) {
  await Promise.all([knex('user').truncate(), knex('local_auth').truncate(), knex('cert_auth').truncate()]);

  const [adminId] = await knex('user')
    .returning('id')
    .insert({ username: 'admin', is_admin: true });
  await knex('local_auth')
    .returning('id')
    .insert({
      email: 'admin@example.com',
      password: await bcrypt.hash('admin', 12),
      user_id: adminId
    });
  await knex('cert_auth')
    .returning('id')
    .insert({
      serial: '00',
      user_id: adminId
    });

  const [userId] = await knex('user')
    .returning('id')
    .insert({ username: 'user', is_admin: false });
  await knex('local_auth')
    .returning('id')
    .insert({
      email: 'user@example.com',
      password: await bcrypt.hash('user', 12),
      user_id: userId
    });
  await knex('cert_auth')
    .returning('id')
    .insert({
      serial: '01',
      user_id: userId
    });
}
