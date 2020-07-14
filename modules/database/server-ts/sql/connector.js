import knex from 'knex';
import { Model } from 'objection';
import * as environments from '../knexdata';

// eslint-disable-next-line import/namespace
const knexObj = knex(environments[process.env.NODE_ENV || 'development']);

// Give the knex instance to objection.
Model.knex(knexObj);

export default knexObj;
