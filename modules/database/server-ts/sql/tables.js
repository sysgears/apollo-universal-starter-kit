import settings from '@gqlapp/config';

const truncateTables = async (knex, Promise, tables) => {
  if (settings.db.client === 'sqlite3') {
    return Promise.all(tables.map(table => knex(table).truncate()));
  } else if (['mysql', 'mysql2'].indexOf(settings.db.client) >= 0) {
    return knex.transaction(async function(trx) {
      await knex.raw('SET FOREIGN_KEY_CHECKS=0').transacting(trx);
      await Promise.all(tables.map(table => knex.raw(`TRUNCATE TABLE ${table}`).transacting(trx)));
      await trx.commit;
      await knex.raw('SET FOREIGN_KEY_CHECKS=1').transacting(trx);
    });
  } else if (settings.db.client === 'pg') {
    return Promise.all(tables.map(table => knex.raw(`TRUNCATE "${table}" RESTART IDENTITY CASCADE`)));
  }
};

export default truncateTables;
