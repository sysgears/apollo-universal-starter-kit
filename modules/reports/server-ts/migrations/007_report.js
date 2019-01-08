exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('report', table => {
      table.increments();
      table.string('name');
      table.string('phone');
      table.string('email');
      table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('report')]);
};
