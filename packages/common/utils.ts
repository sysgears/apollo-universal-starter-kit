import _ from 'lodash';
import { i18n as i18next, Resource } from 'i18next';

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
 * Adds resources into the i18next bundle
 *
 * @param i18n - i18next
 * @param resources - The resources to add
 */
export const addResourcesI18n = (i18n: i18next, resources: Array<{ ns: string; resources: Resource }>) => {
  for (const localization of resources) {
    for (const lang of Object.keys(localization.resources)) {
      i18n.addResourceBundle(
        (i18n.options.whitelist as string[]).filter((lng: string) => lng.indexOf(lang) > -1)[0] || lang,
        localization.ns,
        localization.resources[lang]
      );
    }
  }
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
 * Transforms errors from object into array of object (For Grapqhl type FieldError)
 */
export const transformValidationMessagesForGraphql = (errors: { [key: string]: string }) =>
  Object.keys(errors).reduce((formattedErrors, key) => [...formattedErrors, { field: key, message: errors[key] }], []);

/**
 * Transforms errors array of object into simple object
 */
export const transformValidationMessagesFromGraphql = (errors: Array<{ field: string; message: string }>) =>
  errors.reduce((formattedErrors, error) => ({ ...formattedErrors, [error.field]: error.message }), {});

/**
 * Current platform
 */
export const PLATFORM = getPlatform();
