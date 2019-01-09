import { knex } from '.';

export default async () => new Promise(resolve => knex.transaction(resolve));
