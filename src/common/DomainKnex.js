import changeCase from 'change-case';

import { SchemaTypes } from './DomainSchema';
import log from './log';

const DEBUG = false;

export default class {
  constructor(knex) {
    this.knex = knex;
  }

  _addColumn(tableName, table, key, value) {
    let columnName = changeCase.snakeCase(key);
    let fieldType = typeof value === 'function' ? value.name : value.type.name;
    let column;
    switch (fieldType) {
      case 'Boolean':
        column = table.boolean(columnName);
        break;
      case 'SimpleSchema.Integer':
        column = table.integer(columnName);
        break;
      case 'String':
        column = table.string(columnName, value.max || undefined);
        break;
      default:
        throw new Error(`Don't know how to handle type ${fieldType} of ${tableName}.${columnName}`);
    }
    if (value.unique) {
      column.unique();
    }
    if (!value.optional) {
      column.notNullable();
    }
    if (value.default !== undefined) {
      column.defaultTo(value.default);
    }
  }

  async _createTables(parentTableName, domainSchema) {
    const schema = SchemaTypes.getSchemaInstance(domainSchema);
    if (!schema) {
      throw new Error(`Expected instance of DomainSchema, but got: ${domainSchema}`);
    }
    const tableName = changeCase.snakeCase(domainSchema.name);
    return await this.knex.schema.createTable(tableName, table => {
      if (parentTableName) {
        table
          .integer(`${parentTableName}_id`)
          .unsigned()
          .references('id')
          .inTable(parentTableName)
          .onDelete('CASCADE');
        if (DEBUG) {
          log.debug(`Foreign key ${tableName} -> ${parentTableName}.${parentTableName}_id`);
        }
      }

      table.increments('id');
      table.timestamps(false, true);

      let promises = [];

      for (let key of Object.keys(schema)) {
        if (key === '__') continue;
        const column = changeCase.snakeCase(key);
        let value = schema[key];
        const fieldType = typeof value === 'function' ? value : value.type;
        const subSchema = SchemaTypes.getSchemaInstance(fieldType);
        if (subSchema) {
          const hostTableName = schema.__ && schema.__.transient ? parentTableName : tableName;
          const newPromises = this._createTables(hostTableName, fieldType);
          promises = promises.concat(newPromises.length ? newPromises : [newPromises]);
          if (DEBUG) {
            log.debug(`${subSchema ? 'Schema' : 'Scalar'} key: ${tableName}.${column} -> ${fieldType.name}`);
          }
        } else if (!value.transient && key !== 'id') {
          this._addColumn(tableName, table, key, value);
          if (DEBUG) {
            log.debug(`${subSchema ? 'Schema' : 'Scalar'} key: ${tableName}.${column} -> ${fieldType.name}`);
          }
        }
      }

      return Promise.all(promises);
    });
  }

  _getTableNames(domainSchema) {
    const schema = SchemaTypes.getSchemaInstance(domainSchema);
    if (!schema) {
      throw new Error(`Expected instance of DomainSchema, but got: ${domainSchema}`);
    }
    const tableName = changeCase.snakeCase(domainSchema.name);
    let tableNames = [];

    if (!(schema.__ && schema.__.transient)) {
      tableNames.push(tableName);
    }
    for (let key of Object.keys(schema)) {
      if (key === '__') continue;
      let value = schema[key];
      const fieldType = typeof value === 'function' ? value : value.type;
      if (SchemaTypes.getSchemaInstance(fieldType)) {
        tableNames = tableNames.concat(this._getTableNames(fieldType));
      }
    }

    return tableNames;
  }

  createTables(domainSchema) {
    const schema = SchemaTypes.getSchemaInstance(domainSchema);
    if (!schema) {
      throw new Error(`Expected instance of DomainSchema, but got: ${domainSchema}`);
    } else if (schema.__ && schema.__.transient) {
      throw new Error(`Unable to create tables for transient schema: ${domainSchema}`);
    }
    return this._createTables(null, domainSchema);
  }

  dropTables(domainSchema) {
    const tableNames = this._getTableNames(domainSchema);
    if (DEBUG) {
      log.debug('Dropping tables:', tableNames);
    }
    return Promise.all(tableNames.map(name => this.knex.schema.dropTable(name)));
  }
}
