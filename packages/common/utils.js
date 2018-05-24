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
      return obj[key] !== '' && obj[key] !== 0;
    } else {
      return obj[key] !== '';
    }
  }
};

export const removeEmpty = (obj, schema = null) => {
  return Object.keys(obj)
    .filter(key => removeBySchema(key, obj, schema))
    .reduce((redObj, key) => {
      redObj[key] = obj[key];
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
