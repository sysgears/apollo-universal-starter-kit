export async function up(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable('message', table => {
        table.increments();
        table.string('text').notNull();
        table.integer('userId');
        table.string('uuid');
        table.integer('reply');
        table.timestamps(false, true);
      })
      .createTable('attachment', table => {
        table.increments();
        table.string('name').notNull();
        table.string('type').notNull();
        table.integer('size').notNull();
        table.string('path').notNull();
        table.timestamps(false, true);
      })
  ]);
}

export async function down(knex, Promise) {
  return Promise.all([knex.schema.dropTable('attachment'), knex.schema.dropTable('message')]);
}
