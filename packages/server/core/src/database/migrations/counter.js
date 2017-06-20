export async function up(knex) {
  return knex.schema.createTable('count', table => {
      table.increments();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.integer('amount').notNull();
    });
}

export async function down(knex) {
  return knex.schema.dropTable('count');
}
