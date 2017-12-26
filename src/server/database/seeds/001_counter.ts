import { truncateTables } from '../../../common/db';

const initialAmount = 5;

export const seed = async (knex: any) => {
  await truncateTables(knex, Promise, ['counter']);

  return knex('counter')
    .returning('id')
    .insert({ amount: initialAmount });
};
