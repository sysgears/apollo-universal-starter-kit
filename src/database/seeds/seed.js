const initialAmount = 5;

export function seed(knex, Promise) { // eslint-disable-line import/prefer-default-export
  return Promise.all([
    knex('count').del(),
  ])
  .then(() => {
    return Promise.all(
      knex('count').insert({ amount: initialAmount })
    );
  });
}
