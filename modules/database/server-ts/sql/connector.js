import knex from 'knex';
import * as environments from '../knexdata';

// eslint-disable-next-line import/namespace
export default knex(environments[process.env.NODE_ENV || 'development']);
