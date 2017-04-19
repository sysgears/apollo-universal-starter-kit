exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('count', (table) => {
      table.increments();
      table.timestamps();
      table.integer('amount').notNull();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('count'),
  ]);
};
