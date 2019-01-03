import { knex } from '.';

export default async () => {
  return await new Promise(resolve => knex.transaction(resolve));
};
