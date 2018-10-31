import _ from 'lodash';
import { i18n as i18next, Resource } from 'i18next';

import log from './log';

/**
 * Creates an object composed of the own and inherited enumerable property paths of object that are not omitted,
 * working with the nesting objects.
 *
 * @param obj - The source object
 * @param paths - The property paths to omit
 */
export const nestedOmit = (obj: { [key: string]: any }, paths: string | string[]) => {
  const omittedObject = _.omit(obj, paths);

  Object.keys(omittedObject).forEach((key: string) => {
    if (typeof omittedObject[key] === 'object') {
      omittedObject[key] = nestedOmit(omittedObject[key], paths);
    }
  });

  return omittedObject;
};

/**
 * Removes '__typename' field in the incoming object.
 *
 * @param obj - The source object
 */
export const removeTypename = (obj: { [key: string]: any }) => nestedOmit(obj, '__typename');

/**
 * Wraps target object to trace and log all method calls
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
 * Adds resources into i18next bundle
 *
 * @param i18n - I18next
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
 * Gets current platform
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
