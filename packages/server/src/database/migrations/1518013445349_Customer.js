import KnexGenerator from 'domain-knex';

import { CustomerSchema } from '../../modules/customer/schema';

exports.up = knex => new KnexGenerator(knex).createTables(CustomerSchema);

exports.down = knex => new KnexGenerator(knex).dropTables(CustomerSchema);
