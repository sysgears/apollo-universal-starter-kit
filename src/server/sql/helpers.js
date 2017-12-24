/*eslint-disable no-unused-vars*/
import _ from 'lodash';

export const orderedFor = (rows, collection, field, singleObject) => {
  // return the rows ordered for the collection
  const inGroupsOfField = _.groupBy(rows, field);
  return collection.map(element => {
    const elementArray = inGroupsOfField[element];
    if (elementArray) {
      return singleObject ? elementArray[0] : elementArray;
    }
    return singleObject ? {} : [];
  });
};

export const reconcileBatchOneToOne = (sources, results, matchField) => {
  let cache = {};
  let ret = [];

  for (let src of sources) {
    let r = cache[src[matchField]];
    if (!r) {
      r = results.find(elem => elem[matchField] === src[matchField]);
      cache[src[matchField]] = r;
    }

    if (r) {
      ret.push(r);
    } else {
      ret.push(null);
    }
  }

  return ret;
};

export const reconcileBatchOneToMany = (sources, results, matchField) => {
  let cache = {};
  let ret = [];
  for (let src of sources) {
    // search cache
    let r = cache[src[matchField]];
    if (!r) {
      // find the match
      let match = _.find(results, elem => elem.length > 0 && elem[0][matchField] === src[matchField]);

      // Make the matched entries unique
      // let unique = _.uniqBy(match, matchField);

      r = match;

      cache[src[matchField]] = r;
    }

    // Push into ret
    if (r) {
      ret.push(r);
    } else {
      ret.push([]);
    }
  }

  return ret;
};

export const reconcileBatchManyToMany = (sources, matches, results, sourcesField, resultsField) => {
  // because we have multiple copies of the same source, its how graphql-resolve-batch works
  /*
  console.log("reconcileBatchManyToMany")
  console.log(sources)
  console.log(matches)
  console.log(results)
  console.log(sourcesField, resultsField)
  */
  let cache = {};
  let ret = [];
  for (let src of sources) {
    // search cache
    // console.log("reconcileBatchManyToMany - src", src)
    let r = cache[src[sourcesField]];
    // console.log("reconcileBatchManyToMany - R", r)
    if (!r) {
      // find the sources match
      let match = _.find(matches, elem => elem.length > 0 && elem[0][sourcesField] === src[sourcesField]);
      // console.log("reconcileBatchManyToMany - match", match)

      // Make the matched entries unique
      let unique = _.uniqBy(match, resultsField);
      // console.log("reconcileBatchManyToMany - unique", unique)

      // Pull the results
      r = _.intersectionWith(results, unique, (lhs, rhs) => lhs[resultsField] === rhs[resultsField]);
      // console.log("reconcileBatchManyToMany - r", r)

      cache[src[sourcesField]] = r;
    }

    // Push into ret
    if (r) {
      ret.push(r);
    } else {
      ret.push([]);
    }
  }

  return ret;
};

export default orderedFor;
