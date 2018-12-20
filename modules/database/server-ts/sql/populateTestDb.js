import knex from './connector';

export default async () => {
  await knex.migrate.latest();
  return knex.seed.run();
};
