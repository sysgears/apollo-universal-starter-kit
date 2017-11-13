// Helpers
import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { has } from 'lodash';
import bcrypt from 'bcryptjs';
import KnexGenerator from 'domain-knex';
import parseFields from 'graphql-parse-fields';
import knexnest from 'knexnest';
import { User as UserSchema } from './schema';
import knex from '../../../server/sql/connector';

// from table name
const tableName = decamelize(UserSchema.name);

const fields = {
  id: true,
  username: true,
  password: true,
  email: true,
  role: true,
  isActive: true,
  profile: { firstName: true, lastName: true }
};

// Actual query fetching and transformation in DB
export default class User {
  async getUsers(orderBy, filter, info) {
    const baseQuery = knex(tableName);
    const selectBy = new KnexGenerator(knex).selectBy(UserSchema, parseFields(info));
    const queryBuilder = selectBy(baseQuery);

    // add order by
    if (orderBy && orderBy.column) {
      let column = orderBy.column;
      let order = 'asc';
      if (orderBy.order) {
        order = orderBy.order;
      }

      queryBuilder.orderBy(decamelize(column), order);
    }

    // add filter conditions
    if (filter) {
      if (has(filter, 'role') && filter.role !== '') {
        queryBuilder.where(function() {
          this.where('user.role', filter.role);
        });
      }

      if (has(filter, 'isActive') && filter.isActive !== null) {
        queryBuilder.where(function() {
          this.where('user.is_active', filter.isActive);
        });
      }

      if (has(filter, 'searchText') && filter.searchText !== '') {
        queryBuilder.where(function() {
          this.where('user.username', 'like', `%${filter.searchText}%`)
            .orWhere('user.email', 'like', `%${filter.searchText}%`)
            .orWhere('user_profile.first_name', 'like', `%${filter.searchText}%`)
            .orWhere('user_profile.last_name', 'like', `%${filter.searchText}%`);
        });
      }
    }

    return camelizeKeys(await queryBuilder);
  }

  async getUser(id, info = null) {
    let parsedFields = fields;
    if (info !== null) {
      parsedFields = parseFields(info);
    }

    const baseQuery = knex(tableName);
    const selectBy = new KnexGenerator(knex).selectBy(UserSchema, parsedFields);

    return knexnest(
      selectBy(baseQuery)
        .where(`${tableName}.id`, '=', id)
        .first()
    );
  }

  async getUserWithPassword(id) {
    const baseQuery = knex(tableName);
    const selectBy = new KnexGenerator(knex).selectBy(UserSchema, fields);

    return knexnest(
      selectBy(baseQuery)
        .where(`${tableName}.id`, '=', id)
        .first()
    );
  }

  async getUserWithSerial(serial) {
    fields.auth = {
      certificate: {
        serial: true
      }
    };

    const baseQuery = knex(tableName);
    const selectBy = new KnexGenerator(knex).selectBy(UserSchema, fields);

    return knexnest(
      selectBy(baseQuery)
        .where(`auth_certificate.serial`, '=', serial)
        .first()
    );
  }

  async getUserByEmail(email) {
    const baseQuery = knex(tableName);
    const selectBy = new KnexGenerator(knex).selectBy(UserSchema, fields);

    return knexnest(
      selectBy(baseQuery)
        .where(`${tableName}.email`, '=', email)
        .first()
    );
  }

  async getUserByFbIdOrEmail(id, email) {
    fields.auth = {
      facebook: {
        fbId: true,
        displayName: true
      }
    };

    const baseQuery = knex(tableName);
    const selectBy = new KnexGenerator(knex).selectBy(UserSchema, fields);

    return knexnest(
      selectBy(baseQuery)
        .where('auth_facebook.fb_id', '=', id)
        .orWhere('user.email', '=', email)
        .first()
    );
  }

  async getUserByUsername(username) {
    const baseQuery = knex(tableName);
    const selectBy = new KnexGenerator(knex).selectBy(UserSchema, fields);

    return knexnest(
      selectBy(baseQuery)
        .where('user.username', '=', username)
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
}
