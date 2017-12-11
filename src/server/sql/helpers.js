import _ from 'lodash';

export const orderedFor = (rows, collection, field, singleObject) => {
  let filteredRows = _.filter(rows, row => row.id !== null);
  // return the rows ordered for the collection
  const inGroupsOfField = _.groupBy(filteredRows, field);
  return collection.map(element => {
    const elementArray = inGroupsOfField[element];
    if (elementArray) {
      return singleObject ? elementArray[0] : elementArray;
    }
    return singleObject ? {} : [];
  });
};

export default orderedFor;
