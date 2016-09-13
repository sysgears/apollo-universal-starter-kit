import knex from 'knex'
import { development, production } from '../../../knexfile' // eslint-disable-line import/named

export default knex(process.env.NODE_ENV === "production" ? production : development);
