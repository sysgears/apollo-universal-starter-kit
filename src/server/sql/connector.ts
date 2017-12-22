import * as Knex from 'knex';
import * as environments from '../../../knexdata';

export const knex = Knex(environments[process.env.NODE_ENV]);
