import bcrypt from 'bcryptjs';
import truncateTables from '../../../common/db';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['user_role', 'user', 'user_profile', 'auth_certificate', 'auth_facebook']);

  const [roleAdmin] = await knex('user_role')
    .returning('id')
    .insert({ role: 'admin' });

  const [roleUser] = await knex('user_role')
    .returning('id')
    .insert({ role: 'user' });

  await knex('user_role')
    .returning('id')
    .insert({ role: 'guest' });

  await knex('user')
    .returning('id')
    .insert({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin', 12),
      is_active: true,
      role_id: roleAdmin
    });

  await knex('user')
    .returning('id')
    .insert({
      username: 'user',
      email: 'user@example.com',
      password: await bcrypt.hash('user', 12),
      is_active: true,
      role_id: roleUser
    });
}
