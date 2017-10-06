import * as Knex from 'knex';

const initialAmount = 5;

export const seed = async (knex: Knex) => {
  await knex('counter').truncate();

  return knex('counter')
    .returning('id')
    .insert({ amount: initialAmount });
};
