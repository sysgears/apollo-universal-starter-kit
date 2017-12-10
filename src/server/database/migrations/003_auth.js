exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user_password', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .unique()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.string('password');
    }),
    knex.schema.createTable('user_oauth', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.string('provider');
      table.string('oauth_id');
    }),
    knex.schema.createTable('user_certificates', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.string('serial').unique();
    }),

    knex.schema.createTable('serviceaccount_certificates', table => {
      table.timestamps(true, true);
      table.increments();
      table
        .integer('serviceaccount_id')
        .unsigned()
        .references('id')
        .inTable('serviceaccounts')
        .onDelete('CASCADE');

      table.string('serial').unique();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('serviceaccount_certificate'),
    knex.schema.dropTable('user_certificate'),
    knex.schema.dropTable('user_oauth'),
    knex.schema.dropTable('user_password')
  ]);
};
