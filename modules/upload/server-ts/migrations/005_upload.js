export async function up(knex) {
  return knex.schema.createTable('upload', table => {
    table.increments();
    table.string('name').notNull();
    table.string('type').notNull();
    table.integer('size').notNull();
    table.string('path').notNull();
    table.timestamps(false, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('upload');
}
