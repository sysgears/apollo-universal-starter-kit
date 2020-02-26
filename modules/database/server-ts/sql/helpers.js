import { groupBy, findIndex } from 'lodash';
import { decamelize } from 'humps';

import settings from '@gqlapp/config';

export const returnId = knexTable => (settings.db.client === 'sqlite3' ? knexTable : knexTable.returning('id'));

export const truncateTables = async (knex, Promise, tables) => {
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

export const orderedFor = (rows, collection, field, singleObject, singleField = false) => {
  // return the rows ordered for the collection
  const inGroupsOfField = groupBy(rows, field);
  return collection.map(element => {
    const elementArray = inGroupsOfField[element];
    if (elementArray) {
      return singleObject
        ? singleField
          ? elementArray[0][Object.keys(elementArray[0])[0]]
          : elementArray[0]
        : elementArray;
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

/**
 * Collecting selects and joins
 * @param graphqlFields
 * @param domainSchema
 * @param selectItems
 * @param joinNames
 * @param single
 * @param parentField
 * @private
 */
const _getSelectFields = (graphqlFields, domainSchema, selectItems, joinNames, single, parentKey, parentPath) => {
  for (const fieldName of Object.keys(graphqlFields)) {
    if (fieldName === '__typename') {
      continue;
    }
    const value = domainSchema.values[fieldName];
    if (graphqlFields[fieldName] === true) {
      if (value && value.transient) {
        continue;
      }
      selectItems.push(_getSelectField(fieldName, parentPath, domainSchema, single, parentKey));
    } else {
      if (Array.isArray(value.type) || findIndex(joinNames, { fieldName: decamelize(fieldName) }) > -1) {
        continue;
      }
      if (!value.type.__.transient) {
        joinNames.push(_getJoinEntity(fieldName, value, domainSchema));
      }

      parentPath.push(fieldName);

      _getSelectFields(
        graphqlFields[fieldName],
        value.type,
        selectItems,
        joinNames,
        single,
        decamelize(fieldName),
        parentPath
      );

      parentPath.pop();
    }
  }
};

/**
 * Computing select field
 * @param fieldName
 * @param parentField
 * @param domainSchema
 * @param single
 * @returns {string}
 * @private
 */
const _getSelectField = (fieldName, parentPath, domainSchema, single, parentKey) => {
  const alias = parentPath.length > 0 ? `${parentPath.join('_')}_${fieldName}` : fieldName;
  const tableName = `${decamelize(domainSchema.__.tableName ? domainSchema.__.tableName : domainSchema.name)}`;
  const fullTableName = parentKey !== null && parentKey !== tableName ? `${parentKey}_${tableName}` : tableName;
  // returning object would be array or no
  const arrayPrefix = single ? '' : '_';
  return `${fullTableName}.${decamelize(fieldName)} as ${arrayPrefix}${alias}`;
};

/**
 * Computing join entity object
 * @param fieldName
 * @param value
 * @param domainSchema
 * @returns {{fieldName: *, prefix: string, suffix: string, baseTableName: *, foreignTableName: *}}
 * @private
 */
const _getJoinEntity = (fieldName, value, domainSchema) => {
  return {
    fieldName: decamelize(fieldName),
    prefix: value.type.__.tablePrefix ? value.type.__.tablePrefix : '',
    suffix: value.noIdSuffix ? '' : '_id',
    baseTableName: decamelize(domainSchema.name),
    foreignTableName: decamelize(value.type.__.tableName ? value.type.__.tableName : value.type.name)
  };
};

/**
 * Computing query with selects and joins
 * @param schema
 * @param fields
 * @param single
 * @returns {function(*): *}
 */
export const selectBy = (schema, fields, single = false) => {
  // select fields and joins
  const parentPath = [];
  const selectItems = [];
  const joinNames = [];
  _getSelectFields(fields, schema, selectItems, joinNames, single, null, parentPath);

  return query => {
    // join table names
    joinNames.map(({ fieldName, prefix, suffix, baseTableName, foreignTableName }) => {
      // if fieldName (schema key) diff with table name than make proper table alias
      const tableNameAlias =
        fieldName !== null && fieldName !== foreignTableName ? `${fieldName}_${foreignTableName}` : foreignTableName;
      query.leftJoin(
        `${prefix}${foreignTableName} as ${tableNameAlias}`,
        `${tableNameAlias}.id`,
        `${baseTableName}.${fieldName}${suffix}`
      );
    });

    return query.select(selectItems);
  };
};

export const removeTransient = (data, key, value) => {
  // remove transient field
  if (value && value.transient) {
    delete data[key];
  }
  return data;
};
