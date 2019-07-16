import { isEqual, has } from 'lodash';
import { flatten } from 'flat';

export const onSubmit = async ({ schema, values, updateEntry, createEntry, title, data = null }) => {
  let result = null;
  const insertValues = pickInputFields({ schema, values, data });

  if (data) {
    result = await updateEntry(insertValues, { id: data.id });
  } else {
    result = await createEntry(insertValues);
  }

  if (result && result.errors) {
    let submitError = {
      _error: `Edit ${title} failed!`
    };
    result.errors.map(error => (submitError[error.field] = error.message));
    throw new submitError();
  }
};

export const mapFormPropsToValues = ({ schema, data = null, formType = 'form' }) => {
  let fields = {};
  for (const key of schema.keys()) {
    const value = schema.values[key];
    const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
    if (formType === 'filter') {
      if (value.show !== false && value.type.constructor !== Array) {
        if (hasTypeOf(Date)) {
          fields[`${key}_lte`] = data ? data[key] : '';
          fields[`${key}_gte`] = data ? data[key] : '';
        } else if (hasTypeOf(String)) {
          fields[`${key}_contains`] = data ? data[key] : '';
        } else {
          fields[key] = data ? data[key] : '';
        }
      } else if (value.type.constructor === Array) {
        fields[key] = data ? data[key] : [mapFormPropsToValues({ schema: value.type[0], formType })];
      }
    } else {
      if (value.show !== false) {
        if (value.type.constructor === Array && value.type[0].isSchema) {
          fields[key] = data ? data[key] : [mapFormPropsToValues({ schema: value.type[0], formType })];
        } else {
          fields[key] = data ? data[key] : '';
        }
      }
    }
  }

  return fields;
};

export const pickInputFields = ({ schema, values, data = null, formType = 'form' }) => {
  let inputValues = {};
  //console.log('pickInputFields');
  //console.log('formType:', formType);
  // console.log('values:', values);
  // console.log('data:', data);

  for (const key of schema.keys()) {
    const value = schema.values[key];
    const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
    if (formType === 'filter') {
      if (value.show !== false) {
        if (value.type.constructor !== Array) {
          if (value.type.isSchema && values[key]) {
            inputValues[`${key}Id`] = Number(values[key].id ? values[key].id : values[key]);
          } else if (hasTypeOf(Date)) {
            if (values[`${key}_lte`]) {
              inputValues[`${key}_lte`] = values[`${key}_lte`];
            }
            if (values[`${key}_gte`]) {
              inputValues[`${key}_gte`] = values[`${key}_gte`];
            }
          } else if (hasTypeOf(Boolean)) {
            if (values[key] === 'true') {
              inputValues[key] = 'true';
            } else if (values[key] === 'false') {
              inputValues[key] = 'false';
            } else {
              inputValues[key] = '';
            }
          } else if (hasTypeOf(String)) {
            if (values[`${key}_contains`]) {
              inputValues[`${key}_contains`] = values[`${key}_contains`];
            }
          } else {
            if (key in values && values[key]) {
              inputValues[key] = values[key];
            }
          }
        } else if (value.type.constructor === Array) {
          if (values && values[key] && values.hasOwnProperty(key)) {
            values[key].forEach(item => {
              inputValues[key] = pickInputFields({ schema: value.type[0], values: item, data: null, formType });
            });
          }
        }
      }
    } else {
      if (key in values && has(values, key)) {
        if (value.type.isSchema) {
          inputValues[`${key}Id`] = values[key] ? Number(values[key].id ? values[key].id : values[key]) : null;
        } else if (key !== 'id' && value.type.constructor !== Array) {
          inputValues[key] = values[key];
        } else if (value.type.constructor === Array) {
          const keys1 = {};
          const keys2 = {};

          let create = [];
          let update = [];
          let deleted = [];

          if (data && data.hasOwnProperty(key)) {
            data[key].forEach(item => {
              keys1[item.id] = item;
            });
          }

          if (values && values.hasOwnProperty(key)) {
            values[key].forEach(item => {
              keys2[item.id] = item;
            });
          }

          if (data && data.hasOwnProperty(key)) {
            data[key].forEach(item => {
              const obj = keys2[item.id];
              if (!obj) {
                deleted.push({ id: item.id });
              } else {
                if (!isEqual(obj, item)) {
                  const dataObj = keys1[item.id];
                  update.push({
                    where: { id: obj.id },
                    data: pickInputFields({ schema: value.type[0], values: obj, data: dataObj, formType })
                  });
                }
              }
            });
          }

          if (values && values.hasOwnProperty(key)) {
            if (formType === 'batch') {
              values[key].forEach(item => {
                if (!keys1[item.id]) {
                  const dataObj = keys1[item.id];
                  update.push({
                    where: { id: 0 },
                    data: pickInputFields({ schema: value.type[0], values: item, data: dataObj, formType })
                  });
                }
              });
            } else {
              values[key].forEach(item => {
                if (!keys1[item.id]) {
                  create.push(pickInputFields({ schema: value.type[0], values: item, data: item, formType }));
                }
              });
            }
          }

          //console.log('created: ', create);
          //console.log('updated: ', update);
          //console.log('deleted: ', deleted);

          if (data || formType === 'batch') {
            inputValues[key] = { create, update, delete: deleted };
          } else {
            inputValues[key] = { create };
          }
        }
      }
    }
  }

  //console.log('inputValues:', inputValues);

  return inputValues;
};

export const updateEntry = async ({ ownProps: { refetch }, mutate }, { data, where }, updateEntryName) => {
  try {
    const {
      data: { [updateEntryName]: updateEntry }
    } = await mutate({
      variables: { data, where }
    });

    if (updateEntry.errors) {
      return { errors: updateEntry.errors };
    }

    refetch();

    return updateEntry;
  } catch (e) {
    console.log(e.graphQLErrors);
  }
};

export const deleteEntry = async ({ ownProps: { refetch }, mutate }, { where }, deleteEntryName) => {
  try {
    const {
      data: { [deleteEntryName]: deleteEntry }
    } = await mutate({
      variables: { where }
    });

    if (deleteEntry.errors) {
      return { errors: deleteEntry.errors };
    }

    refetch();

    return deleteEntry;
  } catch (e) {
    console.log(e.graphQLErrors);
  }
};

export const mergeFilter = (filter, defaults, schema) => {
  let mergeFilter = filter;
  if (!filter.hasOwnProperty('searchText')) {
    const { searchText, ...restFilters } = defaults;
    mergeFilter = { ...restFilters, ...filter };
  }

  for (const key of schema.keys()) {
    const value = schema.values[key];
    const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
    if (hasTypeOf(Boolean)) {
      if (mergeFilter[key] === 'true') {
        mergeFilter[key] = 'true';
      } else if (filter[key] === 'false') {
        mergeFilter[key] = 'false';
      }
    }
  }

  // flatten objects with __ delimiter, because apollo state does not allow nested data
  mergeFilter = flatten(mergeFilter, {
    delimiter: '__',
    overwrite: true
  });
  // remove all empty objects
  Object.keys(mergeFilter).map(item => {
    if (typeof mergeFilter[item] === 'object') {
      delete mergeFilter[item];
    }
  });

  return mergeFilter;
};
