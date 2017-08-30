exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', (table) => {
      table.increments();
      table.string('username').unique();
      table.string('email').unique();
      table.string('password');
      table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('user'),
  ]);
};
