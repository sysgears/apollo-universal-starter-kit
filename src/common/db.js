import { decamelize } from 'humps';
import settings from '../../settings';

const _getSelectFields = (fields, parentPath, domainSchema, selectItems, joinNames, single) => {
  for (const key of Object.keys(fields)) {
    if (key !== '__typename') {
      const value = domainSchema.values[key];
      if (fields[key] === true) {
        if (!value.transient) {
          const as = parentPath.length > 0 ? `${parentPath.join('_')}_${key}` : key;
          const arrayPrefix = single ? '' : '_';
          selectItems.push(`${decamelize(domainSchema.name)}.${decamelize(key)} as ${arrayPrefix}${as}`);
        }
      } else {
        if (!value.type.__.transient) {
          joinNames.push({ key: decamelize(key), name: decamelize(value.type.name) });
        }

        parentPath.push(key);

        _getSelectFields(fields[key], parentPath, value.type, selectItems, joinNames, single);

        parentPath.pop();
      }
    }
  }
};

export const selectBy = (schema, fields, single = false, prefix = '') => {
  // form table name
  const tableName = decamelize(schema.name);

  // select fields
  const parentPath = [];
  const selectItems = [];
  const joinNames = [];
  _getSelectFields(fields, parentPath, schema, selectItems, joinNames, single);

  return query => {
    // join table names
    joinNames.map(({ key, name }) => {
      query.leftJoin(`${prefix}${name} as ${name}`, `${name}.id`, `${tableName}.${key}_id`);
    });

    return query.select(selectItems);
  };
};

export const truncateTables = async (knex, Promise, tables) => {
  if (settings.db.dbType === 'sqlite' || process.env.NODE_ENV === 'test') {
    return Promise.all(tables.map(table => knex(table).truncate()));
  } else if (settings.db.dbType === 'mysql') {
    return knex.transaction(async function(trx) {
      await knex.raw('SET FOREIGN_KEY_CHECKS=0').transacting(trx);
      await Promise.all(tables.map(table => knex.raw(`TRUNCATE TABLE ${table}`).transacting(trx)));
      await trx.commit;
      await knex.raw('SET FOREIGN_KEY_CHECKS=1').transacting(trx);
    });
  } else if (settings.db.dbType === 'pg') {
    return Promise.all(tables.map(table => knex.raw(`TRUNCATE "${table}" RESTART IDENTITY CASCADE`)));
  }
};
