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
  let ret = [];

  for (let src of sources) {
    let r = results.find(elem => elem[matchField] === src[matchField]);

    if (r) {
      ret.push(Object.assign({}, r));
    } else {
      ret.push(null);
    }
  }

  return ret;
};

export const reconcileBatchOneToMany = (sources, results, matchField) => {
  // console.log("reconcileBatchOneToMany", matchField)
  // console.log(sources)
  // console.log(results)
  // console.log()
  let ret = [];
  for (let src of sources) {
    // search cache
    // find the match
    let match = _.find(results, elem => elem.length > 0 && elem[0][matchField] === src[matchField]);

    let r = match;

    // Push into ret
    if (r) {
      // ret.push(r)
      ret.push(r.map(elem => Object.assign({}, elem)));
    } else {
      ret.push([]);
    }
  }

  // console.log("1-N", ret)

  return ret;
};

export const reconcileBatchManyToMany = (
  sources,
  matches,
  results,
  sourcesField,
  resultsField,
  matchFilter,
  resultFilter
) => {
  // because we have multiple copies of the same source, its how graphql-resolve-batch works
  // console.log("=".repeat(30))
  // console.log("reconcileBatchManyToMany")

  // console.log(sources)
  // console.log(matches)
  // console.log(results)

  // console.log(sourcesField, resultsField, matchFilter, resultFilter)
  // console.log("=".repeat(30))
  // console.log()

  let ret = [];
  for (let src of sources) {
    // search cache
    // console.log("reconcileBatchManyToMany - src", src)
    // find the sources match
    const match = _.find(
      matches,
      elem =>
        elem.length > 0 &&
        elem[0][sourcesField] === src[sourcesField] &&
        (matchFilter ? elem[0][matchFilter] === src[matchFilter] : true)
    );
    // console.log("reconcileBatchManyToMany - match", match)

    // Make the matched entries unique
    const unique = _.uniqBy(match, resultsField);
    // console.log("reconcileBatchManyToMany - unique", unique)

    // Pull the results
    let r = _.intersectionWith(results, unique, (lhs, rhs) => lhs[resultsField] === rhs[resultsField]);
    for (let elem of r) {
      elem[sourcesField] = src[sourcesField];
    }
    // console.log("reconcileBatchManyToMany - r", r)

    // Filter by source fields (query path driven)
    if (resultFilter) {
      // console.log("filtering", resultFilter, src[resultFilter])
      r = r.filter(elem => elem[resultFilter] === src[resultFilter]);
      // console.log("reconcileBatchManyToMany - f", r)
    }
    // console.log()

    // Push into ret
    if (r) {
      ret.push(r.map(elem => Object.assign({}, elem)));
    } else {
      ret.push([]);
    }
  }
  // console.log(sourcesField, resultsField)
  // console.log("=".repeat(30))
  // console.log()

  return ret;
};

export default orderedFor;
