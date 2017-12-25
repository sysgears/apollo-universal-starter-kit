import settings from '../../../../../../settings';

let config = settings.entities;

exports.up = function(knex, Promise) {
  let migs = [];

  /*
     * Many-to-many Memberships
     */
  if (config.orgs.enabled === true && config.groups.enabled) {
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

      if (config.groups.multipleOrgs === true) {
        // Creates index, only one copy of relationship;
        table.unique(['org_id', 'group_id']);
      } else {
        // Group can only show up once in the table, i.e. can only have one Org tied to it
        table.unique(['group_id']);
      }
    });
    migs.push(fn);
  }

  if (config.orgs.enabled === true && config.users.enabled) {
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

      if (config.users.multipleOrgs === true) {
        table.unique(['org_id', 'user_id']);
      } else {
        table.unique(['user_id']);
      }
    });
    migs.push(fn);
  }

  if (config.orgs.enabled === true && config.serviceaccounts.enabled === true) {
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

      if (config.serviceaccounts.multipleOrgs === true) {
        table.unique(['org_id', 'serviceaccount_id']);
      } else {
        table.unique(['serviceaccount_id']);
      }
    });

    migs.push(fn);
  }

  if (config.groups.enabled === true && config.users.enabled) {
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

      if (config.users.multipleGroups === true) {
        table.unique(['group_id', 'user_id']);
      } else {
        table.unique(['user_id']);
      }
    });

    migs.push(fn);
  }

  if (config.groups.enabled === true && config.serviceaccounts.enabled) {
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

      if (config.serviceaccounts.multipleGroups === true) {
        table.unique(['group_id', 'serviceaccount_id']);
      } else {
        table.unique(['serviceaccount_id']);
      }
    });

    migs.push(fn);
  }

  return Promise.all(migs);
};

exports.down = function(knex, Promise) {
  let migs = [];
  if (config.groups.enabled === true && config.serviceaccounts.enabled) {
    migs.push(knex.schema.dropTable('groups_serviceaccounts'));
  }
  if (config.groups.enabled === true && config.users.enabled) {
    migs.push(knex.schema.dropTable('groups_users'));
  }
  if (config.orgs.enabled === true && config.serviceaccounts.enabled) {
    migs.push(knex.schema.dropTable('orgs_serviceaccounts'));
  }
  if (config.orgs.enabled === true && config.users.enabled) {
    migs.push(knex.schema.dropTable('orgs_users'));
  }
  if (config.orgs.enabled === true && config.groups.enabled) {
    migs.push(knex.schema.dropTable('orgs_groups'));
  }

  return Promise.all(migs);
};
