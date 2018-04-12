import _ from 'lodash';

export const nestedOmit = (obj, iteratee, context) => {
  let r = _.omit(obj, iteratee, context);

  _.each(r, function(val, key) {
    if (typeof val === 'object') r[key] = nestedOmit(val, iteratee, context);
  });

  return r;
};

export const removeTypename = obj => nestedOmit(obj, '__typename');

export const removeEmpty = obj =>
  Object.keys(obj)
    .filter(key => obj[key] !== '')
    .reduce((redObj, key) => {
      redObj[key] = obj[key];
      return redObj;
    }, {});

export const add3Dots = (string, limit) => {
  const dots = '...';
  if (string.length > limit) {
    string = string.substring(0, limit) + dots;
  }
  return string;
};
