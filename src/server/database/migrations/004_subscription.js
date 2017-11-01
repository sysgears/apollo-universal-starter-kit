exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('subscription', table => {
      table.increments();
      table.string('stripe_id').unique();
      table.boolean('active').defaultTo(false);
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('subscription')]);
};
