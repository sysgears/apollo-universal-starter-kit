exports.up = function(knex, Promise) {
  return Promise.all([
    /*
     * Entities
     */
    knex.schema.createTable('orgs', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .uuid('uuid')
        .notNullable()
        .unique();
      table.boolean('is_active').defaultTo(false);

      table
        .string('name')
        .notNullable()
        .unique();
    }),

    knex.schema.createTable('groups', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .uuid('uuid')
        .notNullable()
        .unique();
      table.boolean('is_active').defaultTo(false);

      table
        .string('name')
        .notNullable()
        .unique();
    }),

    knex.schema.createTable('users', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .uuid('uuid')
        .notNullable()
        .unique();
      table.boolean('is_active').defaultTo(false);

      table
        .string('email')
        .notNullable()
        .unique();
    }),

    knex.schema.createTable('serviceaccounts', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .uuid('uuid')
        .notNullable()
        .unique();
      table.boolean('is_active').defaultTo(false);

      table
        .string('email')
        .notNullable()
        .unique();
    }),

    /*
     * Many-to-many Memberships
     */
    knex.schema.createTable('orgs_groups', table => {
      table.timestamps(true, true);

      table
        .integer('org_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');
      table
        .integer('group_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');

      table.unique(['org_id', 'group_id']);
    }),

    knex.schema.createTable('orgs_users', table => {
      table.timestamps(true, true);

      table
        .integer('org_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.unique(['org_id', 'user_id']);
    }),

    knex.schema.createTable('orgs_serviceaccounts', table => {
      table.timestamps(true, true);

      table
        .integer('org_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');
      table
        .integer('serviceaccount_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('serviceaccounts')
        .onDelete('CASCADE');

      table.unique(['org_id', 'serviceaccount_id']);
    }),

    knex.schema.createTable('groups_users', table => {
      table.timestamps(true, true);

      table
        .integer('group_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.unique(['group_id', 'user_id']);
    }),

    knex.schema.createTable('groups_serviceaccounts', table => {
      table.timestamps(true, true);

      table
        .integer('group_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table
        .integer('serviceaccount_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('serviceaccounts')
        .onDelete('CASCADE');

      table.unique(['group_id', 'serviceaccount_id']);
    })
  ]);
};

exports.down = function(knex, Promise) {
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
