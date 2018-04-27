import bcrypt from 'bcryptjs';
import { knexWithId, truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['user', 'user_profile', 'auth_certificate', 'auth_facebook']);

  await knexWithId('user')
    .insert({
      username: 'admin',
      email: 'admin@example.com',
      password_hash: await bcrypt.hash('admin', 12),
      role: 'admin',
      is_active: true
    });

  await knexWithId('user')
    .insert({
      username: 'user1',
      email: 'user@example.com',
      password_hash: await bcrypt.hash('user', 12),
      role: 'user',
      is_active: true
    });
}
