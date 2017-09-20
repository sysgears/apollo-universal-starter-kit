const initialAmount = 5;

export async function seed(knex) {
  await knex('counter').truncate();

  return knex('counter')
    .returning('id')
    .insert({ amount: initialAmount });
}
