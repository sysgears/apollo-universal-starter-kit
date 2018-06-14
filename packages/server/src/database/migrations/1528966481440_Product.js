import KnexGenerator from '@domain-schema/knex';

import { ProductSchema } from '../../modules/product/schema';

exports.up = knex => new KnexGenerator(knex).createTables(ProductSchema);

exports.down = knex => new KnexGenerator(knex).dropTables(ProductSchema);
