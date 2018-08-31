import bcrypt from 'bcryptjs';
import { returnId, truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['subscription']);

  const [subscriberId] = await returnId(knex('user')).insert({
    username: 'subscriber',
    email: 'subscriber@example.com',
    password_hash: await bcrypt.hash('subscriber', 12),
    role: 'user',
    is_active: true
  });
  await returnId(knex('subscription')).insert({
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
