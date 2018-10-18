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

/**
 * Formats Yup error into Graphql Type FieldError
 *
 * @param yupError - Yup error after validation the yup schema
 * @return  Array of formatted errors
 */
export const formatYupError = yupError => {
  return yupError.inner.reduce(
    (formattedErrors, error) => [...formattedErrors, { field: error.path, message: error.message }],
    []
  );
};

/**
 * Prepares errors from FieldError Graphql Type into Formik error type
 *
 * @param errors - Array of errors
 * @return Errors in Formik format (simple object)
 */
export const normalizeErrorsForFormik = errors => {
  const normalizedErrors = {};
  errors.forEach(error => (normalizedErrors[error.field] = error.message));
  return normalizedErrors;
};
