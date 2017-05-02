export async function up(knex) {
  return knex.schema.createTable('count', table => {
      table.increments();
      table.timestamps();
      table.integer('amount').notNull();
    });
}

export async function down(knex) {
  return knex.schema.dropTable('count');
}
