import * as bcrypt from 'bcryptjs';
import * as Knex from 'knex';

import truncateTables from '../../../common/db';

export const seed = async (knex: Knex, Promise: any) => {
  await truncateTables(knex, ['user', 'auth_local', 'auth_certificate', 'auth_facebook']);

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
};
