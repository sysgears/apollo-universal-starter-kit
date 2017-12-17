import bcrypt from 'bcryptjs';
import { truncateTables } from '../../sql/helpers';

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
      stripe_customer_id: 'test',
      stripe_subscription_id: 'test',
      stripe_source_id: 'test',
      active: true,
      expiry_month: 12,
      expiry_year: 2022,
      last4: '1111',
      brand: 'Visa',
      user_id: subscriberId
    });
}
