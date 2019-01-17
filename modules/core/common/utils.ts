import { GraphQLError } from 'graphql';
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
 * Create an error object from graphQLErrors with errors fields for form and message error for alert form
 *
 * @param graphQLErrors - Array errors from graphQL,
 * @param errorMsg - Error message for alert form
 */
export const transformGraphQLErrors = (graphQLErrors: { [key: string]: [GraphQLError] }, errorMsg: string) => {
  if (graphQLErrors.graphQLErrors.length === 1) {
    return { ...graphQLErrors.graphQLErrors[0].extensions.exception.errors, errorMsg };
  }
};

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
  } else if (typeof window === 'undefined') {
    return 'server';
  } else {
    return 'mobile';
  }
};

/**
 * Current platform
 */
export const PLATFORM = getPlatform();
