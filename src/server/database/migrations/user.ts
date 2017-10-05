import * as Knex from 'knex';

exports.up = (knex: Knex, Promise: any) => {
  return Promise.all([
    knex.schema.createTable('user', table => {
      table.increments();
      table.string('username').unique();
      table.boolean('is_admin').defaultTo(false);
      table.timestamps(false, true);
    }),
    knex.schema.createTable('local_auth', table => {
      table.increments();
      table.string('email').unique();
      table.string('password');
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

exports.down = (knex: Knex, Promise: any) => {
  return Promise.all([knex.schema.dropTable('user'), knex.schema.dropTable('local_auth')]);
};
