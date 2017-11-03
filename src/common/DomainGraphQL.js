import DomainSchema from './DomainSchema';
import log from './log';

const DEBUG = false;

export default class {
  constructor() {}

  _generateField(typeName, key, value) {
    let result = `    ${key}: `;
    switch (value.type.name) {
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
        if (value.isSchema) {
          result += value.type.name;
        } else {
          throw new Error(`Don't know how to handle type ${value.type.name} of ${typeName}.${key}`);
        }
    }

    if (!value.optional) {
      result += '!';
    }

    return result;
  }

  generateTypes(schema) {
    const domainSchema = new DomainSchema(schema);

    let results = [];
    let result = `type ${domainSchema.name} {\n`;
    for (let key of domainSchema.keys()) {
      let value = domainSchema.values[key];
      if (!value.private) {
        result += this._generateField(domainSchema.name, key, value) + '\n';
        if (value.isSchema) {
          results.push(this.generateTypes(value.type));
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
