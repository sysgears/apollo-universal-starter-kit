export async function up(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable('message', table => {
        table.increments();
        table.string('text').nullable();
        table.integer('user_id').nullable();
        table.string('uuid').notNull();
        table.integer('quoted_id').nullable();
        table.timestamps(false, true);
      })
      .createTable('attachment', table => {
        table.increments();
        table
          .integer('message_id')
          .nullable()
          .unsigned()
          .references('id')
          .inTable('message')
          .onDelete('CASCADE');
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
