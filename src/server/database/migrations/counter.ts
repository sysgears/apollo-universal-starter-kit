import * as Knex from 'knex';

exports.up = async (knex: Knex) => {
  return knex.schema.createTable('count', table => {
    table.increments();
    table.integer('amount').notNullable();
    table.timestamps(false, true);
  });
};

exports.down = async (knex: Knex) => {
  return knex.schema.dropTable('count');
};
