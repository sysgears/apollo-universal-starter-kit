import settings from '../../../../settings';

let config = settings.entities;

exports.up = function(knex, Promise) {
  let migs = [];

  if (config.orgs.enabled === true) {
    let fn = knex.schema.createTable('org_profile', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('org_id')
        .unsigned()
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
    let fn = knex.schema.createTable('group_profile', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('group_id')
        .unsigned()
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
    let fn = knex.schema.createTable('user_profile', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('user_id')
        .unsigned()
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
    let fn = knex.schema.createTable('serviceaccount_profile', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('serviceaccount_id')
        .unsigned()
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
  return Promise.all([
    knex.schema.dropTable('serviceaccount_profile'),
    knex.schema.dropTable('user_profile'),
    knex.schema.dropTable('group_profile'),
    knex.schema.dropTable('org_profile')
  ]);
};
