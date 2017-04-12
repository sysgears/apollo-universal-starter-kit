import knex from 'knex';
import { development, production } from '../../../knexfile'; // eslint-disable-line import/named

export default knex(__DEV__ ? development : production);
