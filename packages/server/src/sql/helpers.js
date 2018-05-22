import { groupBy } from 'lodash';
import { decamelize } from 'humps';
import settings from '../../../../settings';

export const returnId = knexTable => (settings.db.dbType === 'sqlite' ? knexTable : knexTable.returning('id'));

export const truncateTables = async (knex, Promise, tables) => {
  if (settings.db.dbType === 'sqlite') {
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

export const orderedFor = (rows, collection, field, singleObject) => {
  // return the rows ordered for the collection
  const inGroupsOfField = groupBy(rows, field);
  return collection.map(element => {
    const elementArray = inGroupsOfField[element];
    if (elementArray) {
      return singleObject ? elementArray[0] : elementArray;
    }
    return singleObject ? {} : [];
  });
};

export const orderedForArray = (rows, collection, field, arrayElement) => {
  // return the rows ordered for the collection
  const inGroupsOfField = groupBy(rows, field);
  return collection.map(element => {
    const elementArray = inGroupsOfField[element];
    if (elementArray) {
      return inGroupsOfField[element].map(elm => {
        return elm[arrayElement];
      });
    }
    return [];
  });
};

const _getSelectFields = (fields, parentPath, parentKey, domainSchema, selectItems, joinNames, single) => {
  for (const key of Object.keys(fields)) {
    if (key !== '__typename') {
      const value = domainSchema.values[key];
      if (fields[key] === true) {
        if (value && value.transient) {
          continue;
        }
        const as = parentPath.length > 0 ? `${parentPath.join('_')}_${key}` : key;
        const tableName = `${decamelize(domainSchema.__.tableName ? domainSchema.__.tableName : domainSchema.name)}`;
        const fullTableName = parentKey !== null && parentKey !== tableName ? `${parentKey}_${tableName}` : tableName;
        const arrayPrefix = single ? '' : '_';
        selectItems.push(`${decamelize(fullTableName)}.${decamelize(key)} as ${arrayPrefix}${as}`);
      } else {
        if (value.type.constructor === Array) {
          //console.log('Array');
          //console.log(key);
          //console.log(fields[key]);
          //console.log(value.type[0].name);
        } else {
          if (!value.type.__.transient) {
            joinNames.push({
              key: decamelize(key),
              prefix: value.type.__.tablePrefix ? value.type.__.tablePrefix : '',
              name: decamelize(value.type.__.tableName ? value.type.__.tableName : value.type.name),
              schemaName: decamelize(domainSchema.name)
            });
          }

          parentPath.push(key);

          _getSelectFields(fields[key], parentPath, decamelize(key), value.type, selectItems, joinNames, single);

          parentPath.pop();
        }
      }
    }
  }
};

export const selectBy = (schema, fields, single = false) => {
  // select fields
  const parentPath = [];
  const selectItems = [];
  const joinNames = [];
  _getSelectFields(fields, parentPath, null, schema, selectItems, joinNames, single);

  return query => {
    // join table names
    joinNames.map(({ key, prefix, name, schemaName }) => {
      const tableName = key !== null && key !== name ? `${key}_${name}` : name;
      query.leftJoin(`${prefix}${name} as ${tableName}`, `${tableName}.id`, `${schemaName}.${key}_id`);
    });

    return query.select(selectItems);
  };
};
