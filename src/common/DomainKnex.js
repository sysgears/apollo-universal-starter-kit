import { decamelize } from 'humps';
import DomainSchema from './DomainSchema';
import log from './log';

const DEBUG = false;

export default class {
  constructor(knex) {
    this.knex = knex;
  }

  _addColumn(tableName, table, key, value) {
    let columnName = decamelize(key);
    let column;
    switch (value.type.name) {
      case 'Boolean':
        column = table.boolean(columnName);
        break;
      case 'Integer':
        column = table.integer(columnName);
        break;
      case 'String':
        column = table.string(columnName, value.max || undefined);
        break;
      default:
        throw new Error(`Don't know how to handle type ${value.type.name} of ${tableName}.${columnName}`);
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

  async _createTables(parentTableName, schema) {
    const domainSchema = new DomainSchema(schema);
    const tableName = decamelize(domainSchema.name);
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

      for (let key of domainSchema.keys()) {
        const column = decamelize(key);
        const value = domainSchema.values[key];
        if (value.isSchema) {
          const hostTableName = domainSchema.__.transient ? parentTableName : tableName;
          const newPromises = this._createTables(hostTableName, value.type);
          promises = promises.concat(newPromises.length ? newPromises : [newPromises]);
          if (DEBUG) {
            log.debug(`Schema key: ${tableName}.${column} -> ${value.type.name}`);
          }
        } else if (!value.transient && key !== 'id') {
          this._addColumn(tableName, table, key, value);
          if (DEBUG) {
            log.debug(`Scalar key: ${tableName}.${column} -> ${value.type.name}`);
          }
        }
      }

      return Promise.all(promises);
    });
  }

  _getTableNames(schema) {
    const domainSchema = new DomainSchema(schema);
    const tableName = decamelize(domainSchema.name);
    let tableNames = [];

    if (domainSchema.__.transient) {
      tableNames.push(tableName);
    }
    for (let key of domainSchema.keys()) {
      const value = domainSchema.values[key];
      if (value.isSchema) {
        tableNames = tableNames.concat(this._getTableNames(value.type));
      }
    }

    return tableNames;
  }

  createTables(schema) {
    const domainSchema = new DomainSchema(schema);
    if (domainSchema.__.transient) {
      throw new Error(`Unable to create tables for transient schema: ${domainSchema.name}`);
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
