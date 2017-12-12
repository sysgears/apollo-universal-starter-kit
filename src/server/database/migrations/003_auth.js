exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user_password', table => {
      table.timestamps(true, true);
      table
        .integer('user_id')
        .unsigned()
        .unique()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.string('password');
    }),
    knex.schema.createTable('user_oauths', table => {
      table.timestamps(true, true);
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.string('provider');
      table.string('oauth_id');
      table.unique(['user_id', 'provider', 'oauth_id']);
    }),
    knex.schema.createTable('user_apikeys', table => {
      table.timestamps(true, true);
      table
        .integer('user_id')
        .unsigned()
        .unique()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.string('name');
      table.string('key');
      table.unique(['user_id', 'name']);
    }),
    knex.schema.createTable('user_certificates', table => {
      table.timestamps(true, true);
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.string('name');
      table.string('serial');

      table.unique(['user_id', 'name']);
    }),

    knex.schema.createTable('serviceaccount_apikeys', table => {
      table.timestamps(true, true);
      table
        .integer('serviceaccount_id')
        .unsigned()
        .unique()
        .references('id')
        .inTable('serviceaccounts')
        .onDelete('CASCADE');

      table.string('key');
    }),

    knex.schema.createTable('serviceaccount_certificates', table => {
      table.timestamps(true, true);
      table
        .integer('serviceaccount_id')
        .unsigned()
        .unique()
        .references('id')
        .inTable('serviceaccounts')
        .onDelete('CASCADE');

      table.string('serial').unique();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('serviceaccount_certificates'),
    knex.schema.dropTable('user_certificates'),
    knex.schema.dropTable('user_oauths'),
    knex.schema.dropTable('user_apikeys'),
    knex.schema.dropTable('user_password')
  ]);
};
