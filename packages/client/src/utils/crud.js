import { isEqual, has } from 'lodash';

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
        } else {
          fields[key] = data ? data[key] : '';
        }
      } else if (value.type.constructor === Array) {
        fields[key] = data ? data[key] : [];
      }
    } else {
      if (value.show !== false && value.type.constructor !== Array) {
        fields[key] = data ? data[key] : '';
      } else if (value.type.constructor === Array) {
        fields[key] = data ? data[key] : [];
      }
    }
  }

  return fields;
};

export const pickInputFields = ({ schema, values, data = null, formType = 'form' }) => {
  let inputValues = {};
  //console.log('pickInputFields');
  //console.log('formType:', formType);
  //console.log(values);

  for (const key of schema.keys()) {
    const value = schema.values[key];
    const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
    if (formType === 'filter') {
      if (value.show !== false && value.type.constructor !== Array) {
        if (value.type.isSchema && values[key]) {
          inputValues[`${key}Id`] = Number(values[key].id ? values[key].id : values[key]);
        } else if (hasTypeOf(Date)) {
          if (values[`${key}_lte`]) {
            inputValues[`${key}_lte`] = values[`${key}_lte`];
          }
          if (values[`${key}_gte`]) {
            inputValues[`${key}_gte`] = values[`${key}_gte`];
          }
        } else {
          if (key in values && values[key]) {
            inputValues[key] = values[key];
          }
        }
      }
    } else {
      if (key in values && has(values, key)) {
        if (value.type.isSchema) {
          inputValues[`${key}Id`] = Number(values[key].id ? values[key].id : values[key]);
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
                  update.push({
                    where: { id: obj.id },
                    data: pickInputFields({ schema: value.type[0], values: obj, data: obj })
                  });
                }
              }
            });
          }

          if (values && values.hasOwnProperty(key)) {
            values[key].forEach(item => {
              if (!keys1[item.id]) {
                create.push(pickInputFields({ schema: value.type[0], values: item, data: item }));
              }
            });
          }

          //console.log('created: ', create);
          //console.log('updated: ', update);
          //console.log('deleted: ', deleted);

          if (data) {
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
