export async function up(knex) {
  return knex.schema.createTable('counter', table => {
    table.increments();
    table.integer('amount').notNull();
    table.timestamps(false, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('counter');
}
