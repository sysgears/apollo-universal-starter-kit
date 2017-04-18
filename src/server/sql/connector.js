import knex from 'knex';
import * as environments from '../../../knexfile'; // eslint-disable-line import/named

console.log("Knex env:", process.env.NODE_ENV);

export default knex(environments[process.env.NODE_ENV]);
