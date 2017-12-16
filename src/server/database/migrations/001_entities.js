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

    fn = knex.schema.createTable('org_profile', table => {
      table.timestamps(true, true);
      table
        .uuid('org_id')
        .unique()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');

      table.string('domain');
      table.string('display_name');
      table.string('description');
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

    fn = knex.schema.createTable('group_profile', table => {
      table.timestamps(true, true);
      table
        .uuid('group_id')
        .unique()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');

      table.string('display_name');
      table.string('description');
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

    fn = knex.schema.createTable('user_profile', table => {
      table.timestamps(true, true);
      table
        .uuid('user_id')
        .unique()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.string('display_name');
      table.string('first_name');
      table.string('middle_name');
      table.string('last_name');
      table.string('title');
      table.string('suffix');
      table.string('locale');
      table.string('language');
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

    fn = knex.schema.createTable('serviceaccount_profile', table => {
      table.timestamps(true, true);
      table
        .uuid('serviceaccount_id')
        .unique()
        .references('id')
        .inTable('serviceaccounts')
        .onDelete('CASCADE');

      table.string('display_name');
      table.string('description');
    });

    migs.push(fn);
  }

  return Promise.all(migs);
};

exports.down = function(knex, Promise) {
  let migs = [];

  if (config.serviceaccounts.enabled === true) {
    migs.push(knex.schema.dropTable('serviceaccount_profile'));
    migs.push(knex.schema.dropTable('serviceaccounts'));
  }

  if (config.users.enabled === true) {
    migs.push(knex.schema.dropTable('user_profile'));
    migs.push(knex.schema.dropTable('users'));
  }

  if (config.groups.enabled === true) {
    migs.push(knex.schema.dropTable('group_profile'));
    migs.push(knex.schema.dropTable('groups'));
  }

  if (config.orgs.enabled === true) {
    migs.push(knex.schema.dropTable('org_profile'));
    migs.push(knex.schema.dropTable('orgs'));
  }

  // probably need migs and the same checks here too
  return Promise.all(migs);
};
