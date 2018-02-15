import KnexGenerator from 'domain-knex';

import { TestModuleSchema } from '../../modules/testModule/schema';

exports.up = knex => new KnexGenerator(knex).createTables(TestModuleSchema);

exports.down = knex => new KnexGenerator(knex).dropTables(TestModuleSchema);
