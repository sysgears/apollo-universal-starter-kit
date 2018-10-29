import _ from 'lodash';
import log from './log';

export const nestedOmit = (obj, iteratee, context) => {
  let r = _.omit(obj, iteratee, context);

  _.each(r, function(val, key) {
    if (typeof val === 'object') r[key] = nestedOmit(val, iteratee, context);
  });

  return r;
};

export const removeTypename = obj => nestedOmit(obj, '__typename');

/**
 * Wraps target object to trace and log all method calls
 *
 * @param {*} obj target object to trace
 */
export const traceMethodCalls = obj => {
  return new Proxy(obj, {
    get(target, property) {
      const origProperty = target[property];
      return function(...args) {
        const result = origProperty.apply(target, args);
        log.debug(property + JSON.stringify(args) + ' -> ' + JSON.stringify(result));
        return result;
      };
    }
  });
};

// Get current platform
const getPlatform = () => {
  if (typeof document !== 'undefined') {
    return 'web';
  } else if (typeof window === 'undefined') {
    return 'server';
  } else {
    return 'mobile';
  }
};

export const PLATFORM = getPlatform();

const removeBySchema = (key, obj, schema) => {
  if (schema === null) {
    return obj[key] !== '';
  } else {
    const schemaKey = key.endsWith('Id') ? key.substring(0, key.length - 2) : key;
    if (schema.values[schemaKey].type.isSchema) {
      return obj[key] !== '' && obj[key] !== null;
    } else {
      return obj[key] !== '';
    }
  }
};

export const removeEmpty = (obj, schema = null) => {
  return Object.keys(obj)
    .filter(key => removeBySchema(key, obj, schema))
    .reduce((redObj, key) => {
      if (schema && schema.values[key] && schema.values[key].type.constructor === Array) {
        if (obj[key].create && obj[key].create.length > 0) {
          let tmpObj = obj[key];
          tmpObj.create[0] = removeEmpty(obj[key].create[0], schema.values[key].type[0]);
          redObj[key] = tmpObj;
        } else if (obj[key].update && obj[key].update.length > 0) {
          let tmpObj = obj[key];
          tmpObj.update[0].data = removeEmpty(obj[key].update[0].data, schema.values[key].type[0]);
          redObj[key] = tmpObj;
        } else {
          redObj[key] = obj[key];
        }
      } else {
        redObj[key] = obj[key];
      }

      return redObj;
    }, {});
};

export const add3Dots = (string, limit) => {
  const dots = '...';
  if (string.length > limit) {
    string = string.substring(0, limit) + dots;
  }
  return string;
};
