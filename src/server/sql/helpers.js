import _ from 'lodash';

export const orderedFor = (rows, collection, field, singleObject) => {
  // return the rows ordered for the collection
  const inGroupsOfField = _.groupBy(rows, field);
  return collection.map(element => {
    if (rows.length === 1 && rows[0].id === null) {
      return singleObject ? {} : [];
    }
    const elementArray = inGroupsOfField[element];
    if (elementArray) {
      return singleObject ? elementArray[0] : elementArray;
    }
    return singleObject ? {} : [];
  });
};

export default orderedFor;
