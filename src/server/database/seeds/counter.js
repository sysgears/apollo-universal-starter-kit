const initialAmount = 5;

exports.seed = function(knex) {
  return knex('count').truncate()
    .then(() => {
      return knex('count').insert({ amount: initialAmount });
    });
};
