const initialAmount = 5;

export async function seed(knex) {
  await knex('count').truncate();

  return knex('count').insert({ amount: initialAmount });
}
