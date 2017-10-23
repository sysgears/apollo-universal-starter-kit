import bcrypt from 'bcryptjs';
import truncateTables from '../../../common/db';

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

  const [subscriberId] = await knex('user')
    .returning('id')
    .insert({ username: 'subscriber', is_active: true, is_admin: false });
  await knex('auth_local')
    .returning('id')
    .insert({
      email: 'subscriber@example.com',
      password: await bcrypt.hash('subscriber', 12),
      user_id: subscriberId
    });
  await knex('subscription')
    .returning('id')
    .insert({
      stripe_id: 'test',
      active: true,
      user_id: subscriberId
    });
  await knex('auth_certificate')
    .returning('id')
    .insert({
      serial: '02',
      user_id: userId
    });
}
