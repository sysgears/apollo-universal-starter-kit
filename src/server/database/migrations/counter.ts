import * as Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('count', table => {
    table.increments();
    table.integer('amount').notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('count');
}
