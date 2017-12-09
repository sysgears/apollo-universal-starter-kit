exports.up = function(knex, Promise) {
  return Promise.all([
    /*
     * Entities
     */
    knex.schema.createTable('orgs', table => {
      table.timestamps(true, true);
      table.increments();
      table.uuid('uuid').notNullable();
      table.boolean('is_active').defaultTo(false);

      table.string('name').notNullable();
      table.string('domain').notNullable();
      table.unique(['name', 'domain']);
    }),
    knex.schema.createTable('groups', table => {
      table.timestamps(true, true);
      table.increments();
      table.uuid('uuid').notNullable();
      table.boolean('is_active').defaultTo(false);

      table.string('name').notNullable();
    }),
    knex.schema.createTable('users', table => {
      table.timestamps(true, true);
      table.increments();
      table.uuid('uuid').notNullable();
      table.boolean('is_active').defaultTo(false);

      table.string('email').unique();
    }),

    knex.schema.createTable('serviceaccounts', table => {
      table.timestamps(true, true);
      table.increments();
      table.uuid('uuid').notNullable();
      table.boolean('is_active').defaultTo(false);

      table.string('email').unique();
    }),

    /*
     * Many-to-many Memberships
     */
    knex.schema.createTable('orgs_groups', table => {
      table.timestamps(true, true);
      table.increments();

      table
        .integer('org_id')
        .unsigned()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');
      table
        .integer('group_id')
        .unsigned()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
    }),

    knex.schema.createTable('groups_users', table => {
      table.timestamps(true, true);
      table.increments();

      table
        .integer('group_id')
        .unsigned()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
    }),

    knex.schema.createTable('groups_serviceaccounts', table => {
      table.timestamps(true, true);
      table.increments();

      table
        .integer('group_id')
        .unsigned()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table
        .integer('serviceaccount_id')
        .unsigned()
        .references('id')
        .inTable('serviceaccounts')
        .onDelete('CASCADE');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('groups_serviceaccounts'),
    knex.schema.dropTable('groups_users'),
    knex.schema.dropTable('orgs_groups'),

    knex.schema.dropTable('serviceaccounts'),
    knex.schema.dropTable('users'),
    knex.schema.dropTable('groups'),
    knex.schema.dropTable('orgs')
  ]);
};
