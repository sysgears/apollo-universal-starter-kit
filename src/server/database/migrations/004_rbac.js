/*
 * Roles exist at the Org level
 * Roles are assigned to groups
 * Permissions are assigned to Roles
 * Premissions are granted a set of Verbs on a Resource
 *
 * Resource Naming: ?
 *    org:[id].group[id].user[id].object/path/[id]
 *    id can be the wildcard '*'
 *
 *    org/groups/user may be omitted?
 */

import settings from '../../../../settings';

let config = settings.auth.authorization;

exports.up = function(knex, Promise) {
  let migs = [];

  if (config.enabled !== true) {
    return Promise.all(migs);
  }

  if (config.method === 'basic' && config.basic.provider === 'embedded') {
    let basic = config.basic;

    /*
      let fn = knex.schema.createTable('role_permissions', table => {
        table.timestamps(true, true);

        table
          .uuid('role_id')
          .notNullable()
          .references('id')
          .inTable('roles')
          .onDelete('CASCADE');

        table.string('resource').notNullable();
        table.enu('verb', basic.verbs).notNullable();

        table.unique(['role_id', 'resource', 'verb']);

        table.string('name');
        table.string('description');
      });

      migs.push(fn);
    */

    if (basic.subjects.orgs) {
      let fn = knex.schema.createTable('org_roles', table => {
        table.timestamps(true, true);

        table.enu('role', basic.roles).notNullable();

        table
          .uuid('org_id')
          .notNullable()
          .unique()
          .references('id')
          .inTable('orgs')
          .onDelete('CASCADE');
      });

      migs.push(fn);
    }

    if (basic.subjects.groups) {
      let fn = knex.schema.createTable('group_roles', table => {
        table.timestamps(true, true);

        table.enu('role', basic.roles).notNullable();

        table
          .uuid('group_id')
          .notNullable()
          .unique()
          .references('id')
          .inTable('groups')
          .onDelete('CASCADE');
      });

      migs.push(fn);
    }

    if (basic.subjects.users) {
      let fn = knex.schema.createTable('user_roles', table => {
        table.timestamps(true, true);

        table.enu('role', basic.roles).notNullable();

        table
          .uuid('user_id')
          .notNullable()
          .unique()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
      });

      migs.push(fn);
    }

    if (basic.subjects.serviceaccounts) {
      let fn = knex.schema.createTable('serviceaccount_roles', table => {
        table.timestamps(true, true);

        table.enu('role', basic.roles).notNullable();

        table
          .uuid('serviceaccount_id')
          .notNullable()
          .unique()
          .references('id')
          .inTable('serviceaccounts')
          .onDelete('CASCADE');
      });

      migs.push(fn);
    }
  }

  if (config.method === 'rbac' && config.rbac.provider === 'embedded') {
    // Roles table
    let fn1 = knex.schema.createTable('roles', table => {
      table.timestamps(true, true);
      table.increments();

      table.string('name').notNullable();
      table
        .integer('org_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');

      table.unique(['name', 'org_id']);

      table.string('displayName');
      table.string('description');
    });

    // Roles Membership table
    let fn2 = knex.schema.createTable('role_memberships', table => {
      table.timestamps(true, true);

      table
        .integer('role_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE');
      table
        .integer('group_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');

      table.unique(['role_id', 'group_id']);
    });

    // Role Grants table
    let fn3 = knex.schema.createTable('role_permissions', table => {
      table.timestamps(true, true);

      table
        .integer('role_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE');
      table.string('resource').notNullable();
      table.enu('verb', config.rbac.verbs).notNullable();

      table.unique(['role_id', 'resource', 'verb']);

      table.string('name');
      table.string('description');
    });

    migs.push(fn1);
    migs.push(fn2);
    migs.push(fn3);
  }

  return Promise.all(migs);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('role_permissions'),
    knex.schema.dropTable('role_memberships'),
    knex.schema.dropTable('role')
  ]);
};
