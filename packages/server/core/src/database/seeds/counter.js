const initialAmount = 5;

export async function seed(knex) {
  await knex('count').truncate();

  return knex('count').returning('id').insert({ amount: initialAmount });
}
