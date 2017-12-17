import bcrypt from 'bcryptjs';
import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['user', 'user_profile', 'auth_certificate', 'auth_facebook']);

  await knex('user')
    .returning('id')
    .insert({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin', 12),
      role: 'admin',
      is_active: true
    });

  await knex('user')
    .returning('id')
    .insert({
      username: 'user',
      email: 'user@example.com',
      password: await bcrypt.hash('user', 12),
      role: 'user',
      is_active: true
    });
}
