import _ from 'lodash';

import log from './log';

/**
 * Removes the specified paths from the input object and the nested objects.
 * Returns a new object composed of the properties that were not removed.
 *
 * @param obj - The source object
 * @param paths - The property paths to remove
 */
export const omitNested = (obj: { [key: string]: any }, paths: string | string[]) => {
  const omittedObject = _.omit(obj, paths);

  Object.keys(omittedObject).forEach((key: string) => {
    if (typeof omittedObject[key] === 'object') {
      omittedObject[key] = omitNested(omittedObject[key], paths);
    }
  });

  return omittedObject;
};

/**
 * Removes the '__typename' field from the incoming object.
 *
 * @param obj - The source object
 */
export const removeTypename = (obj: { [key: string]: any }) => omitNested(obj, '__typename');

/**
 * Wraps the target object to trace and log all method calls
 *
 * @param {*} obj target object to trace
 */
export const traceMethodCalls = (obj: any) => {
  return new Proxy(obj, {
    get(target, property) {
      const origProperty = target[property];
      return (...args: any[]) => {
        const result = origProperty.apply(target, args);
        log.debug(`${String(property)}${JSON.stringify(args) + ' -> ' + JSON.stringify(result)}`);
        return result;
      };
    }
  });
};

/**
 * Gets the current platform such as web, server, or mobile
 */
const getPlatform = () => {
  if (typeof document !== 'undefined') {
    return 'web';
  } else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'mobile';
  } else {
    return 'server';
  }
};

/**
 * Current platform
 */
export const PLATFORM = getPlatform();

const removeBySchema = (key: any, obj: any, schema: any) => {
  if (schema === null) {
    return obj[key] !== '';
  } else {
    const schemaKey = key.endsWith('Id') ? key.substring(0, key.length - 2) : key;
    if (schema && schema.values[schemaKey] && schema.values[schemaKey].type.isSchema) {
      return obj[key] !== '' && obj[key] !== null;
    } else {
      return obj[key] !== '';
    }
  }
};

export const removeEmpty = (obj: any, schema: any = null) => {
  return Object.keys(obj)
    .filter(key => removeBySchema(key, obj, schema))
    .reduce((redObj, key) => {
      if (schema && schema.values[key]) {
        const hasTypeOf = (targetType: any) =>
          schema.values[key].type === targetType || schema.values[key].type.prototype instanceof targetType;
        if (schema.values[key].type.constructor === Array) {
          if (obj[key].create && obj[key].create.length > 0) {
            const tmpObj = obj[key];
            tmpObj.create[0] = removeEmpty(obj[key].create[0], schema.values[key].type[0]);
            redObj[key] = tmpObj;
          } else if (obj[key].update && obj[key].update.length > 0) {
            const tmpObj = obj[key];
            tmpObj.update[0].data = removeEmpty(obj[key].update[0].data, schema.values[key].type[0]);
            redObj[key] = tmpObj;
          } else if (schema.values[key].type[0].isSchema) {
            redObj[key] = removeEmpty(obj[key], schema.values[key].type[0]);
          } else {
            redObj[key] = obj[key];
          }
        } else if (hasTypeOf(Number)) {
          redObj[key] = Number(obj[key]);
        } else if (hasTypeOf(Boolean)) {
          redObj[key] = obj[key] === 'true' ? true : false;
        } else {
          redObj[key] = obj[key];
        }
      } else {
        redObj[key] = obj[key];
      }

      return redObj;
    }, {});
};

export const add3Dots = (str: any, limit: any) => {
  const dots = '...';
  if (str.length > limit) {
    str = str.substring(0, limit) + dots;
  }
  return str;
};
