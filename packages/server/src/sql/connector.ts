import * as knex from 'knex';
import * as environments from '../../knexdata';

export default knex(environments[process.env.NODE_ENV]);
