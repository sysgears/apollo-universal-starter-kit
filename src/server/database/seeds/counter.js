const initialAmount = 5;

export function seed(knex) { // eslint-disable-line import/prefer-default-export
  return knex('count').truncate()
    .then(() => {
      return knex('count').insert({ amount: initialAmount });
    });
}
