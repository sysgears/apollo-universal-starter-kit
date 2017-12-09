exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('org_profile', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('org_id')
        .unsigned()
        .unique()
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');

      table.string('display_name');
      table.string('description');
    }),

    knex.schema.createTable('group_profile', table => {
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
    }),

    knex.schema.createTable('user_profile', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .unique()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');

      table.string('display_name');
      table.string('first_name');
      table.string('last_name');
    }),

    knex.schema.createTable('serviceaccount_profile', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('serviceaccount_id')
        .unsigned()
        .unique()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');

      table.string('display_name');
      table.string('description');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('serviceaccount_profile'),
    knex.schema.dropTable('user_profile'),
    knex.schema.dropTable('group_profile'),
    knex.schema.dropTable('org_profile')
  ]);
};
