exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable('chat', table => {
        table.increments();
        table.string('title');
        table.string('content');
        table.timestamps(false, true);
      })
      .createTable('message', table => {
        table.increments();
        table
          .integer('chat_id')
          .unsigned()
          .references('id')
          .inTable('chat')
          .onDelete('CASCADE');

        table.string('content');
        table.timestamps(false, true);
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('message'), knex.schema.dropTable('chat')]);
};
