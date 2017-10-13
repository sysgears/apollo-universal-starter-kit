import * as Knex from 'knex';
import truncateTables from '../../../common/db';

const initialAmount = 5;

export const seed = async (knex: Knex) => {
  await truncateTables(knex, ['counter']);

  return knex('counter')
    .returning('id')
    .insert({ amount: initialAmount });
};
