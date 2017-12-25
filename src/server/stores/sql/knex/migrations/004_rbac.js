import settings from '../../../../../../settings';

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

let entities = settings.entities;
let authz = settings.auth.authorization;

exports.up = async function(knex, Promise) {
  let migs = [];

  // short-circuit
  if (authz.enabled !== true || authz.provider !== 'embedded') {
    console.log('NOT !! Creating Authz Tablesi... :[');
    return Promise.all(migs);
  }

  console.log('Creating Authz Tables');

  // All Known Permissions
  await knex.schema.createTable('permissions', table => {
    console.log('  - permissions table');
    table.timestamps(true, true);
    table
      .uuid('id')
      .notNullable()
      .unique();

    table.string('resource').notNullable();
    table.string('relation').notNullable();
    table.enu('verb', authz.verbs).notNullable();

    table.unique(['resource', 'relation', 'verb']);

    table
      .string('name')
      .notNullable()
      .unique();

    table.string('display_name');
    table.string('description');
  });

  // Set up org authz
  if (entities.orgs.enabled && authz.orgRoles) {
    console.log('  - orgs authz tables');

    await knex.schema.createTable('org_roles', table => {
      table.timestamps(true, true);
      table
        .uuid('id')
        .notNullable()
        .unique();

      table
        .uuid('org_id')
        .notNullable()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');
      table.string('name').notNullable();
      table.unique(['org_id', 'name']);

      table.string('display_name');
      table.string('description');
    });

    let fn = knex.schema.createTable('org_role_permission_bindings', table => {
      table.timestamps(true, true);

      table
        .uuid('role_id')
        .notNullable()
        .references('id')
        .inTable('org_roles')
        .onDelete('CASCADE');
      table
        .uuid('permission_id')
        .notNullable()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE');

      table.unique(['role_id', 'permission_id']);
    });

    migs.push(fn);

    fn = knex.schema.createTable('org_role_user_bindings', table => {
      table.timestamps(true, true);
      table
        .uuid('role_id')
        .notNullable()
        .references('id')
        .inTable('org_roles')
        .onDelete('CASCADE');
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.unique(['role_id', 'user_id']);
    });

    migs.push(fn);

    if (entities.serviceaccounts.enabled) {
      fn = knex.schema.createTable('org_role_serviceaccount_bindings', table => {
        table.timestamps(true, true);
        table
          .uuid('role_id')
          .notNullable()
          .references('id')
          .inTable('org_roles')
          .onDelete('CASCADE');
        table
          .uuid('serviceaccount_id')
          .notNullable()
          .references('id')
          .inTable('serviceaccounts')
          .onDelete('CASCADE');
        table.unique(['role_id', 'serviceaccount_id']);
      });

      migs.push(fn);
    }
  }

  // Set up group authz
  if (entities.groups.enabled && authz.groupRoles) {
    console.log('  - groups authz tables');
    // have to wait on the first one
    await knex.schema.createTable('group_roles', table => {
      table.timestamps(true, true);
      table
        .uuid('id')
        .notNullable()
        .unique();

      table
        .uuid('group_id')
        .notNullable()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table.string('name').notNullable();
      table.unique(['group_id', 'name']);

      table.string('display_name');
      table.string('description');
    });

    let fn = knex.schema.createTable('group_role_permission_bindings', table => {
      table.timestamps(true, true);

      table
        .uuid('role_id')
        .notNullable()
        .references('id')
        .inTable('group_roles')
        .onDelete('CASCADE');
      table
        .uuid('permission_id')
        .notNullable()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE');

      table.unique(['role_id', 'permission_id']);
    });

    migs.push(fn);

    fn = knex.schema.createTable('group_role_user_bindings', table => {
      table.timestamps(true, true);
      table
        .uuid('role_id')
        .notNullable()
        .references('id')
        .inTable('group_roles')
        .onDelete('CASCADE');
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.unique(['role_id', 'user_id']);
    });

    migs.push(fn);

    if (entities.serviceaccounts.enabled) {
      fn = knex.schema.createTable('group_role_serviceaccount_bindings', table => {
        table.timestamps(true, true);
        table
          .uuid('role_id')
          .notNullable()
          .references('id')
          .inTable('group_roles')
          .onDelete('CASCADE');
        table
          .uuid('serviceaccount_id')
          .notNullable()
          .references('id')
          .inTable('serviceaccounts')
          .onDelete('CASCADE');
        table.unique(['role_id', 'serviceaccount_id']);
      });

      migs.push(fn);
    }
  }

  if (entities.users.enabled && authz.userRoles) {
    console.log('  - users authz tables');
    await knex.schema.createTable('user_roles', table => {
      table.timestamps(true, true);
      table
        .uuid('id')
        .notNullable()
        .unique();
      table.string('name').notNullable();
      table.unique(['name']);

      table.string('display_name');
      table.string('description');
    });

    let fn = knex.schema.createTable('user_role_permission_bindings', table => {
      table.timestamps(true, true);

      table
        .uuid('role_id')
        .notNullable()
        .references('id')
        .inTable('user_roles')
        .onDelete('CASCADE');
      table
        .uuid('permission_id')
        .notNullable()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE');

      table.unique(['role_id', 'permission_id']);
    });

    migs.push(fn);

    fn = knex.schema.createTable('user_role_user_bindings', table => {
      table.timestamps(true, true);
      table
        .uuid('role_id')
        .notNullable()
        .references('id')
        .inTable('user_roles')
        .onDelete('CASCADE');
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.unique(['role_id', 'user_id']);
    });

    migs.push(fn);
  }

  if (entities.serviceaccounts.enabled && authz.serviceaccountRoles) {
    console.log('  - serviceaccounts authz tables');
    let fn = knex.schema.createTable('serviceaccount_roles', table => {
      table.timestamps(true, true);

      table.enu('role', authz.serviceaccountRoles).notNullable();

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

  return Promise.all(migs);
};

exports.down = function(knex, Promise) {
  let migs = [];

  // short-circuit
  if (authz.enabled !== true || authz.provider !== 'embedded') {
    return Promise.all(migs);
  }

  if (entities.orgs.enabled && authz.orgRoles) {
    migs.push(knex.schema.dropTable('org_roles'));
    migs.push(knex.schema.dropTable('org_role_permission_bindings'));
    migs.push(knex.schema.dropTable('org_role_user_bindings'));
    if (entities.serviceaccounts.enabled) {
      migs.push(knex.schema.dropTable('org_role_serviceaccount_bindings'));
    }
  }

  if (entities.groups.enabled && authz.groupRoles) {
    migs.push(knex.schema.dropTable('group_roles'));
    migs.push(knex.schema.dropTable('group_role_permission_bindings'));
    migs.push(knex.schema.dropTable('group_role_user_bindings'));
    if (entities.serviceaccounts.enabled) {
      migs.push(knex.schema.dropTable('group_role_serviceaccount_bindings'));
    }
  }

  if (entities.users.enabled && authz.userRoles) {
    migs.push(knex.schema.dropTable('user_roles'));
    migs.push(knex.schema.dropTable('user_role_permission_bindings'));
    migs.push(knex.schema.dropTable('user_role_user_bindings'));
  }

  if (entities.serviceaccounts.enabled && authz.serviceaccountRoles) {
    migs.push(knex.schema.dropTable('serviceaccount_roles'));
    migs.push(knex.schema.dropTable('serviceaccount_role_permission_bindings'));
    migs.push(knex.schema.dropTable('serviceaccount_role_serviceaccount_bindings'));
  }

  migs.push(knex.schema.dropTable('permissions'));

  return Promise.all(migs);
};
