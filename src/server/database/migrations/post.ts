import * as Knex from 'knex';

exports.up = (knex: Knex, Promise: any) => {
  return Promise.all([
    knex.schema
      .createTable('post', table => {
        table.increments();
        table.string('title');
        table.string('content');
        table.timestamps(false, true);
      })
      .createTable('comment', table => {
        table.increments();
        table
          .integer('post_id')
          .unsigned()
          .references('id')
          .inTable('post')
          .onDelete('CASCADE');
        table.string('content');
        table.timestamps(false, true);
      })
  ]);
};

exports.down = (knex: Knex, Promise: any) => {
  return Promise.all([knex.schema.dropTable('post'), knex.schema.dropTable('comment')]);
};
