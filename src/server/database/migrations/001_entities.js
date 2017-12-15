import settings from '../../../../settings';

let config = settings.entities;

exports.up = function(knex, Promise) {
  let migs = [];

  if (config.orgs.enabled === true) {
    let fn = knex.schema.createTable('orgs', table => {
      table.timestamps(true, true);
      table
        .uuid('id')
        .notNullable()
        .unique();
      table.boolean('is_active').defaultTo(false);

      table
        .string('name')
        .notNullable()
        .unique();
    });

    migs.push(fn);
  }

  if (config.groups.enabled === true) {
    let fn = knex.schema.createTable('groups', table => {
      table.timestamps(true, true);
      table
        .uuid('id')
        .notNullable()
        .unique();
      table.boolean('is_active').defaultTo(false);

      table
        .string('name')
        .notNullable()
        .unique();
    });

    migs.push(fn);
  }

  if (config.users.enabled === true) {
    let fn = knex.schema.createTable('users', table => {
      table.timestamps(true, true);
      table
        .uuid('id')
        .notNullable()
        .unique();
      table.boolean('is_active').defaultTo(false);

      table
        .string('email')
        .notNullable()
        .unique();
    });

    migs.push(fn);
  }

  if (config.serviceaccounts.enabled === true) {
    let fn = knex.schema.createTable('serviceaccounts', table => {
      table.timestamps(true, true);
      table
        .uuid('id')
        .notNullable()
        .unique();
      table.boolean('is_active').defaultTo(false);

      table
        .string('email')
        .notNullable()
        .unique();
    });

    migs.push(fn);
  }

  /*
     * Many-to-many Memberships
     */
  if (config.orgs.enabled === true && config.groups.enabled && config.groups.multipleOrgs === true) {
    let fn = knex.schema.createTable('orgs_groups', table => {
      table.timestamps(true, true);

      table
        .uuid('org_id')
        .notNullable()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');
      table
        .uuid('group_id')
        .notNullable()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');

      table.unique(['org_id', 'group_id']);
    });
    migs.push(fn);
  }

  if (config.orgs.enabled === true && config.users.enabled && config.users.multipleOrgs === true) {
    let fn = knex.schema.createTable('orgs_users', table => {
      table.timestamps(true, true);

      table
        .uuid('org_id')
        .notNullable()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.unique(['org_id', 'user_id']);
    });
    migs.push(fn);
  }

  if (
    config.orgs.enabled === true &&
    config.serviceaccounts.enabled === true &&
    config.serviceaccounts.multipleOrgs === true
  ) {
    let fn = knex.schema.createTable('orgs_serviceaccounts', table => {
      table.timestamps(true, true);

      table
        .uuid('org_id')
        .notNullable()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');
      table
        .uuid('serviceaccount_id')
        .notNullable()
        .references('id')
        .inTable('serviceaccounts')
        .onDelete('CASCADE');

      table.unique(['org_id', 'serviceaccount_id']);
    });

    migs.push(fn);
  }

  if (config.groups.enabled === true && config.users.enabled && config.users.multipleGroups === true) {
    let fn = knex.schema.createTable('groups_users', table => {
      table.timestamps(true, true);

      table
        .uuid('group_id')
        .notNullable()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.unique(['group_id', 'user_id']);
    });

    migs.push(fn);
  }

  if (
    config.groups.enabled === true &&
    config.serviceaccounts.enabled &&
    config.serviceaccounts.multipleGroups === true
  ) {
    let fn = knex.schema.createTable('groups_serviceaccounts', table => {
      table.timestamps(true, true);

      table
        .uuid('group_id')
        .notNullable()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table
        .uuid('serviceaccount_id')
        .notNullable()
        .references('id')
        .inTable('serviceaccounts')
        .onDelete('CASCADE');

      table.unique(['group_id', 'serviceaccount_id']);
    });

    migs.push(fn);
  }

  return Promise.all(migs);
};

exports.down = function(knex, Promise) {
  // probably need migs and the same checks here too
  return Promise.all([
    knex.schema.dropTable('groups_serviceaccounts'),
    knex.schema.dropTable('groups_users'),
    knex.schema.dropTable('orgs_serviceaccounts'),
    knex.schema.dropTable('orgs_users'),
    knex.schema.dropTable('orgs_groups'),

    knex.schema.dropTable('serviceaccounts'),
    knex.schema.dropTable('users'),
    knex.schema.dropTable('groups'),
    knex.schema.dropTable('orgs')
  ]);
};
