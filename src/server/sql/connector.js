import knex from 'knex';
import * as environments from '../../../knexfile';

// eslint-disable-next-line import/namespace
export default knex(environments[process.env.NODE_ENV]);
