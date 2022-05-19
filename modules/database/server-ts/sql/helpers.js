import { groupBy } from 'lodash';

import settings from '@gqlapp/config';

export const returnId = (knexTable) => (settings.db.client === 'sqlite3' ? knexTable : knexTable.returning('id'));

export const truncateTables = async (knex, Promise, tables) => {
  if (settings.db.client === 'sqlite3') {
    return Promise.all(tables.map((table) => knex(table).truncate()));
  }
  if (['mysql', 'mysql2'].indexOf(settings.db.client) >= 0) {
    return knex.transaction(async function (trx) {
      await knex.raw('SET FOREIGN_KEY_CHECKS=0').transacting(trx);
      await Promise.all(tables.map((table) => knex.raw(`TRUNCATE TABLE ${table}`).transacting(trx)));
      await trx.commit;
      await knex.raw('SET FOREIGN_KEY_CHECKS=1').transacting(trx);
    });
  }
  if (settings.db.client === 'pg') {
    return Promise.all(tables.map((table) => knex.raw(`TRUNCATE "${table}" RESTART IDENTITY CASCADE`)));
  }
};

export const orderedFor = (rows, collection, field, singleObject) => {
  // return the rows ordered for the collection
  const inGroupsOfField = groupBy(rows, field);
  return collection.map((element) => {
    const elementArray = inGroupsOfField[element];
    if (elementArray) {
      return singleObject ? elementArray[0] : elementArray;
    }
    return singleObject ? {} : [];
  });
};
