import * as Knex from 'knex';

import settings from '../../settings';

const truncateTables = async (knex: Knex, tables: string[]) => {
  if (settings.db.dbType === 'sqlite' || process.env.NODE_ENV === 'test') {
    return Promise.all(tables.map(table => knex(table).truncate()));
  } else if (settings.db.dbType === 'mysql') {
    return knex.transaction(async trx => {
      await knex.raw('SET FOREIGN_KEY_CHECKS=0');
      await Promise.all(tables.map(table => knex.raw(`TRUNCATE TABLE ${table}`)));
      await trx.commit;
      await knex.raw('SET FOREIGN_KEY_CHECKS=1');
    });
  } else if (settings.db.dbType === 'pg') {
    return Promise.all(tables.map(table => knex.raw(`TRUNCATE "${table}" RESTART IDENTITY CASCADE`)));
  }
};

export default truncateTables;
