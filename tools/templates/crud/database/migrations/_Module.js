import KnexGenerator from 'domain-knex';

import { $Module$ } from '../../modules/$module$/schema';

exports.up = knex => new KnexGenerator(knex).createTables($Module$);

exports.down = knex => new KnexGenerator(knex).dropTables($Module$);
