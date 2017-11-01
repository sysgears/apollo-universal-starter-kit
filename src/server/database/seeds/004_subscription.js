import bcrypt from 'bcryptjs';
import truncateTables from '../../../common/db';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['subscription']);

  const [subscriberId] = await knex('user')
    .returning('id')
    .insert({
      username: 'subscriber',
      email: 'subscriber@example.com',
      password: await bcrypt.hash('subscriber', 12),
      role: 'user',
      is_active: true
    });
  await knex('subscription')
    .returning('id')
    .insert({
      stripe_id: 'test',
      active: true,
      user_id: subscriberId
    });
}
