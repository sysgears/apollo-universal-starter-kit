exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', table => {
      table.increments();
      table.string('username').unique();
      table.string('email').unique();
      table.string('password_hash');
      table.string('role').defaultTo('user');
      table.boolean('is_active').defaultTo(false);
      table.timestamps(false, true);
    }),
    knex.schema.createTable('user_profile', table => {
      table.increments();
      table.string('first_name');
      table.string('last_name');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    }),
    knex.schema.createTable('auth_certificate', table => {
      table.increments();
      table.string('serial').unique();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    }),
    knex.schema.createTable('auth_facebook', table => {
      table.increments();
      table.string('fb_id').unique();
      table.string('display_name');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    }),
    knex.schema.createTable('auth_google', table => {
      table.increments();
      table.string('google_id').unique();
      table.string('display_name');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    }),
    knex.schema.createTable('auth_github', table => {
      table.increments();
      table.string('gh_id').unique();
      table.string('display_name');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    }),
    knex.schema.createTable('auth_linkedin', table => {
      table.increments();
      table.string('ln_id').unique();
      table.string('display_name');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('auth_certificate'),
    knex.schema.dropTable('auth_facebook'),
    knex.schema.dropTable('auth_google'),
    knex.schema.dropTable('auth_github'),
    knex.schema.dropTable('auth_linkedin'),
    knex.schema.dropTable('user_profile'),
    knex.schema.dropTable('user')
  ]);
};
