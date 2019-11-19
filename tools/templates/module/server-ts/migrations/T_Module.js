import KnexGenerator from '@domain-schema/knex';
import { $Module$Schema } from '@gqlapp/$-module$-common';

exports.up = knex => new KnexGenerator(knex).createTables($Module$Schema);

exports.down = knex => new KnexGenerator(knex).dropTables($Module$Schema);
