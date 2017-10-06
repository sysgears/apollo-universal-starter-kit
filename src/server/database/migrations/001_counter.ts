import * as Knex from 'knex';

export const up = async (knex: Knex) => {
  return knex.schema.createTable('counter', table => {
    table.increments();
    table.integer('amount').notNullable();
    table.timestamps(false, true);
  });
};

export const down = async (knex: Knex) => {
  return knex.schema.dropTable('counter');
};
