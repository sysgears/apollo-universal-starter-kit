import settings from '../../../../../../settings';

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
      table.boolean('is_public').defaultTo(true);

      table
        .string('name')
        .notNullable()
        .unique();

      table.string('url_name').unique();
      table.string('display_name');
      table.string('locale'); // Let's go i18n !!
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

      // maybe a json object would be useful here for development?
      // one for public and one for private?
      table.boolean('is_public').defaultTo(true);
      table.string('domain');
      table.string('description');
    });

    migs.push(fn);

    fn = knex.schema.createTable('org_settings', table => {
      table.timestamps(true, true);
      table
        .uuid('org_id')
        .unique()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');
      table.boolean('is_public').defaultTo(true);

      table.boolean('membership_is_open').defaultTo(false);
      table.boolean('membership_by_request').defaultTo(false);
      table.boolean('membership_by_invite').defaultTo(true);
      table.boolean('membership_by_direct').defaultTo(true);

      table.boolean('memberlist_is_public').defaultTo(false);
      // user can override when and how? ... how about groups?
      // column creeeeeeep!!! maybe it's ok because they are all booleans?
      // maybe a json object would be useful here for development?
      // same with profiles?

      // overrides or scopes group level permissions
      table.boolean('grouplist_is_public').defaultTo(false);
      table.boolean('groupmemberlist_is_public').defaultTo(false);
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
      table.boolean('is_public').defaultTo(true);

      table
        .string('name')
        .notNullable()
        .unique();

      table.string('url_name').unique();
      table.string('display_name');
      table.string('locale'); // Let's go i18n !!
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

      table.boolean('is_public').defaultTo(true);
      table.string('description');
    });

    migs.push(fn);

    fn = knex.schema.createTable('group_settings', table => {
      table.timestamps(true, true);
      table
        .uuid('group_id')
        .unique()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table.boolean('is_public').defaultTo(true);

      table.boolean('membership_is_open').defaultTo(false);
      table.boolean('membership_by_request').defaultTo(true);
      table.boolean('membership_by_invite').defaultTo(true);
      table.boolean('membership_by_direct').defaultTo(true);
      table.boolean('memberlist_is_public').defaultTo(false);
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
      table.boolean('is_public').defaultTo(true);

      table
        .string('email')
        .notNullable()
        .unique();

      table.string('url_name').unique();
      table.string('display_name');
      table.string('locale'); // Let's go i18n !!
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

      table.boolean('is_public').defaultTo(false);
      table.string('first_name');
      table.string('middle_name');
      table.string('last_name');
      table.string('title');
      table.string('suffix');
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
