export const up = async (knex: any, Promise: any) => {
  return Promise.all([
    knex.schema
      .createTable('post', (table: any) => {
        table.increments();
        table.string('title');
        table.string('content');
        table.timestamps(false, true);
      })
      .createTable('comment', (table: any) => {
        table.increments();
        table
          .integer('post_id')
          .unsigned()
          .references('id')
          .inTable('post')
          .onDelete('CASCADE');
        table.string('content');
        table.timestamps(false, true);
      })
  ]);
};

exports.down = (knex: any, Promise: any) => {
  return Promise.all([knex.schema.dropTable('comment'), knex.schema.dropTable('post')]);
};
