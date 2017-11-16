export const up = async (knex: any) => {
  return knex.schema.createTable('counter', (table: any) => {
    table.increments();
    table.integer('amount').notNullable();
    table.timestamps(false, true);
  });
};

export const down = async (knex: any) => {
  return knex.schema.dropTable('counter');
};
