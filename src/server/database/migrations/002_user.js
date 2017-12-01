import KnexGenerator from 'domain-knex';

import { User } from '../../modules/user/schema';

exports.up = knex => new KnexGenerator(knex).createTables(User);

exports.down = knex => new KnexGenerator(knex).dropTables(User);
