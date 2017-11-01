import changeCase from 'change-case';

import { SchemaTypes } from './DomainSchema';

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
    const tableName = changeCase.snakeCase(domainSchema.name);
    return await this.knex.schema.createTable(tableName, table => {
      if (parentTableName) {
        table
          .integer(`${parentTableName}_id`)
          .unsigned()
          .references('id')
          .inTable(parentTableName)
          .onDelete('CASCADE');
        // console.log(`Foreign key ${tableName} -> ${parentTableName}.${parentTableName}_id`)
      }

      table.increments('id');
      table.timestamps(false, true);

      let promises = [];

      const schema = SchemaTypes.getSchemaInstance(domainSchema);
      for (let key of Object.keys(schema)) {
        if (key === '__') continue;
        // let column = changeCase.snakeCase(key);
        // let type = typeof value === 'function' ? value.name : value.type.name;
        let value = schema[key];
        const subSchema = SchemaTypes.getSchemaInstance(value);
        if (subSchema) {
          const hostTableName = schema.__ && schema.__.transient ? parentTableName : tableName;
          const newPromises = this._createTables(hostTableName, value);
          promises = promises.concat(newPromises.length ? newPromises : [newPromises]);
          // console.log(`${subSchema ? 'Schema' : 'Scalar'} key: ${tableName}.${column} -> ${type}`);
        } else if (!value.transient) {
          this._addColumn(tableName, table, key, value);
          // console.log(`${subSchema ? 'Schema' : 'Scalar'} key: ${tableName}.${column} -> ${type}`);
        }
      }

      return Promise.all(promises);
    });
  }

  _getTableNames(domainSchema) {
    const tableName = changeCase.snakeCase(domainSchema.name);
    let tableNames = [];

    const schema = SchemaTypes.getSchemaInstance(domainSchema);
    if (!(schema.__ && schema.__.transient)) {
      tableNames.push(tableName);
    }
    for (let key of Object.keys(schema)) {
      if (key === '__') continue;
      let value = schema[key];
      const subSchema = SchemaTypes.getSchemaInstance(value);
      if (subSchema) {
        tableNames = tableNames.concat(this._getTableNames(value));
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
    const schema = SchemaTypes.getSchemaInstance(domainSchema);
    if (!schema) {
      throw new Error(`Expected instance of DomainSchema, but got: ${domainSchema}`);
    }
    const tableNames = this._getTableNames(domainSchema);
    // console.log('Dropping tables:', tableNames);
    return Promise.all(tableNames.map(name => this.knex.schema.dropTable(name)));
  }
}
