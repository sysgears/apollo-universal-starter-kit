/* eslint-disable no-unused-vars */
import _ from 'lodash';

export const reconcileBatchOneToOne = (sources, results, matchField) => {
  const ret = [];

  for (const src of sources) {
    const r = results.find((elem) => elem[matchField] === src[matchField]);

    if (r) {
      ret.push({ ...r });
    } else {
      ret.push(null);
    }
  }

  return ret;
};

export const reconcileBatchOneToMany = (sources, results, matchField) => {
  const ret = [];
  for (const src of sources) {
    // search cache
    // find the match
    const match = _.find(results, (elem) => elem.length > 0 && elem[0][matchField] === src[matchField]);

    const r = match;

    // Push into ret
    if (r) {
      // ret.push(r)
      ret.push(r.map((elem) => ({ ...elem })));
    } else {
      ret.push([]);
    }
  }

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
  const ret = [];
  for (const src of sources) {
    // find the sources match
    const match = _.find(
      matches,
      (elem) =>
        elem.length > 0 &&
        elem[0][sourcesField] === src[sourcesField] &&
        (matchFilter ? elem[0][matchFilter] === src[matchFilter] : true)
    );

    // Make the matched entries unique
    const unique = _.uniqBy(match, resultsField);

    // Pull the results
    let r = _.intersectionWith(results, unique, (lhs, rhs) => lhs[resultsField] === rhs[resultsField]);
    for (const elem of r) {
      elem[sourcesField] = src[sourcesField];
    }

    // Filter by source fields (query path driven)
    if (resultFilter) {
      r = r.filter((elem) => elem[resultFilter] === src[resultFilter]);
    }

    // Push into ret
    if (r) {
      ret.push(r.map((elem) => ({ ...elem })));
    } else {
      ret.push([]);
    }
  }

  return ret;
};

export default {
  reconcileBatchOneToOne,
  reconcileBatchOneToMany,
  reconcileBatchManyToMany,
};
