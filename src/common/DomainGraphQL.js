import { SchemaTypes } from './DomainSchema';
import log from './log';

const DEBUG = false;

export default class {
  constructor() {}

  _generateField(typeName, key, value) {
    let result = `    ${key}: `;
    const fieldType = typeof value === 'function' ? value : value.type;
    switch (fieldType.name) {
      case 'Boolean':
        result += 'Boolean';
        break;
      case 'ID':
        result += 'ID';
        break;
      case 'Integer':
        result += 'Int';
        break;
      case 'String':
        result += 'String';
        break;
      default:
        if (SchemaTypes.getSchemaInstance(fieldType)) {
          result += fieldType.name;
        } else {
          throw new Error(`Don't know how to handle type ${fieldType.name} of ${typeName}.${key}`);
        }
    }

    if (!value.optional) {
      result += '!';
    }

    return result;
  }

  generateTypes(domainSchema) {
    const schema = SchemaTypes.getSchemaInstance(domainSchema);
    if (!schema) {
      throw new Error(`Expected instance of DomainSchema, but got: ${domainSchema}`);
    }

    let results = [];
    let result = `type ${domainSchema.name} {\n`;
    for (let key of Object.keys(schema)) {
      if (key === '__') continue;
      let value = schema[key];
      const fieldType = typeof value === 'function' ? value : value.type;
      if (!value.private) {
        result += this._generateField(domainSchema.name, key, value) + '\n';
        if (SchemaTypes.getSchemaInstance(fieldType)) {
          results.push(this.generateTypes(fieldType));
        }
      }
    }

    result += '}';
    results.push(result);

    if (DEBUG) {
      log.debug(results.join('\n'));
    }

    return results.join('\n');
  }
}
