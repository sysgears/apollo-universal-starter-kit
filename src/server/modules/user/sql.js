// Helpers
import { camelizeKeys, decamelizeKeys } from 'humps';
import bcrypt from 'bcryptjs';
import knex from '../../../server/sql/connector';

import { ordering } from '../../../server/sql/ordering';
import paging from '../../../server/sql/paging';
import { currentFilter } from '../../../server/sql/filters';

// Actual query fetching and transformation in DB
export default class User {
  async getUsers(orderBy, filter, limit, offset) {
    let queryBuilder = knex
      .select(
        'u.id as id',
        'u.username',
        'u.role',
        'u.is_active',
        'u.email',
        'up.first_name',
        'up.last_name',
        'ca.serial',
        'fa.fb_id',
        'fa.display_name AS fbDisplayName',
        'ga.google_id',
        'ga.display_name AS googleDisplayName'
      )
      .from('user AS u')
      .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
      .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
      .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
      .leftJoin('auth_google AS ga', 'ga.user_id', 'u.id');

    // Add filters
    queryBuilder = currentFilter(queryBuilder, filter);

    // Add limit / offset
    queryBuilder = paging(queryBuilder, { limit, offset });

    // add result ordering
    queryBuilder = ordering(queryBuilder, [orderBy]);

    return camelizeKeys(await queryBuilder);
  }

  async getUser(id) {
    return camelizeKeys(
      await knex
        .select(
          'u.id',
          'u.username',
          'u.role',
          'u.is_active',
          'u.email',
          'up.first_name',
          'up.last_name',
          'ca.serial',
          'fa.fb_id',
          'fa.display_name AS fbDisplayName',
          'ga.google_id',
          'ga.display_name AS googleDisplayName'
        )
        .from('user AS u')
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
        .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
        .leftJoin('auth_google AS ga', 'ga.user_id', 'u.id')
        .where('u.id', '=', id)
        .first()
    );
  }

  async getUserWithPassword(id) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.password', 'u.role', 'u.is_active', 'u.email', 'up.first_name', 'up.last_name')
        .from('user AS u')
        .where('u.id', '=', id)
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .first()
    );
  }

  async getUserWithSerial(serial) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.role', 'u.is_active', 'ca.serial', 'up.first_name', 'up.last_name')
        .from('user AS u')
        .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .where('ca.serial', '=', serial)
        .first()
    );
  }

  async register({ username, email, password, role, isActive }) {
    const passwordHashed = await bcrypt.hash(password, 12);

    if (role === undefined) {
      role = 'user';
    }

    return knex('user')
      .insert({ username, email, role, password: passwordHashed, is_active: !!isActive })
      .returning('id');
  }

  createFacebookOuth({ id, displayName, userId }) {
    return knex('auth_facebook')
      .insert({ fb_id: id, display_name: displayName, user_id: userId })
      .returning('id');
  }

  createGoogleOuth({ id, displayName, userId }) {
    return knex('auth_google')
      .insert({ google_id: id, display_name: displayName, user_id: userId })
      .returning('id');
  }

  async editUser({ id, username, email, role, isActive, password }) {
    let localAuthInput = { email };
    if (password) {
      const passwordHashed = await bcrypt.hash(password, 12);
      localAuthInput = { email, password: passwordHashed };
    }

    return knex('user')
      .update({
        username,
        role,
        is_active: isActive,
        ...localAuthInput
      })
      .where({ id });
  }

  async editUserProfile({ id, profile }) {
    const userProfile = await knex
      .select('id')
      .from('user_profile')
      .where({ user_id: id })
      .first();

    if (userProfile) {
      return knex('user_profile')
        .update(decamelizeKeys(profile))
        .where({ user_id: id });
    } else {
      return knex('user_profile')
        .insert({ ...decamelizeKeys(profile), user_id: id })
        .returning('id');
    }
  }

  async editAuthCertificate({ id, auth: { certificate: { serial } } }) {
    const userProfile = await knex
      .select('id')
      .from('auth_certificate')
      .where({ user_id: id })
      .first();

    if (userProfile) {
      return knex('auth_certificate')
        .update({ serial })
        .where({ user_id: id });
    } else {
      return knex('auth_certificate')
        .insert({ serial, user_id: id })
        .returning('id');
    }
  }

  deleteUser(id) {
    return knex('user')
      .where('id', '=', id)
      .del();
  }

  async updatePassword(id, newPassword) {
    const password = await bcrypt.hash(newPassword, 12);

    return knex('user')
      .update({ password })
      .where({ id });
  }

  updateActive(id, isActive) {
    return knex('user')
      .update({ is_active: isActive })
      .where({ id });
  }

  async getUserByEmail(email) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.password', 'u.role', 'u.is_active', 'u.email', 'up.first_name', 'up.last_name')
        .from('user AS u')
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .where({ email })
        .first()
    );
  }

  async getUserByFbIdOrEmail(id, email) {
    return camelizeKeys(
      await knex
        .select(
          'u.id',
          'u.username',
          'u.role',
          'u.is_active',
          'fa.fb_id',
          'u.email',
          'u.password',
          'up.first_name',
          'up.last_name'
        )
        .from('user AS u')
        .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .where('fa.fb_id', '=', id)
        .orWhere('u.email', '=', email)
        .first()
    );
  }

  async getUserByGoogleIdOrEmail(id, email) {
    return camelizeKeys(
      await knex
        .select(
          'u.id',
          'u.username',
          'u.role',
          'u.is_active',
          'ga.google_id',
          'u.email',
          'u.password',
          'up.first_name',
          'up.last_name'
        )
        .from('user AS u')
        .leftJoin('auth_google AS ga', 'ga.user_id', 'u.id')
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .where('ga.google_id', '=', id)
        .orWhere('u.email', '=', email)
        .first()
    );
  }

  async getUserByUsername(username) {
    return camelizeKeys(
      await knex
        .select('u.id', 'u.username', 'u.role', 'u.is_active', 'u.email', 'up.first_name', 'up.last_name')
        .from('user AS u')
        .where('u.username', '=', username)
        .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
        .first()
    );
  }
}
