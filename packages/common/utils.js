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
