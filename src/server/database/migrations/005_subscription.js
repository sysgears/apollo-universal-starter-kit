import settings from '../../../../settings';

let config = settings.subscription;

exports.up = function(knex, Promise) {
  let migs = [];
  if (config.enabled === true) {
    let fn = knex.schema.createTable('user_subscriptions', table => {
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
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    });

    migs.push(fn);

    fn = knex.schema.createTable('org_subscriptions', table => {
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
        .uuid('org_id')
        .references('id')
        .inTable('orgs')
        .onDelete('CASCADE');
      table.timestamps(false, true);
    });

    migs.push(fn);
  }

  return Promise.all(migs);
};

exports.down = function(knex, Promise) {
  if (config.enabled === true) {
    return Promise.all([knex.schema.dropTable('user_subscriptions'), knex.schema.dropTable('org_subscriptions')]);
  }
};
