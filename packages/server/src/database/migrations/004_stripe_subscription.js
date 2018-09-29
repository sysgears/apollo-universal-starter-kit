exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('stripe_subscription', table => {
      table.increments();
      table.string('stripe_customer_id').unique();
      table.string('stripe_source_id').unique();
      table.string('stripe_subscription_id').unique();
      table.boolean('active').defaultTo(false);
      table.integer('expiry_month');
      table.integer('expiry_year');
      table.string('last4');
      table.string('brand');
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
  return Promise.all([knex.schema.dropTable('stripe_subscription')]);
};
