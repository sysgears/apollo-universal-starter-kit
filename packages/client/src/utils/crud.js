import { isEqual } from 'lodash';

export const onSubmit = async (schema, values, updateEntry, createEntry, title, node = null) => {
  let result = null;
  const insertValues = pickInputFields(schema, values, node);

  if (node) {
    result = await updateEntry(insertValues, { id: node.id });
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

export const pickInputFields = (schema, values, node = null) => {
  let inputValues = {};
  //console.log('pickInputFields');
  //console.log(values);

  for (const key of schema.keys()) {
    if (key in values) {
      const value = schema.values[key];
      if (value.type.isSchema) {
        if (values[key]) {
          inputValues[`${key}Id`] = Number(values[key].id ? values[key].id : values[key]);
        }
      } else if (key !== 'id' && value.type.constructor !== Array) {
        inputValues[key] = values[key];
      } else if (value.type.constructor === Array) {
        const keys1 = {};
        const keys2 = {};

        let create = [];
        let update = [];
        let deleted = [];

        node[key].forEach(item => {
          keys1[item.id] = item;
        });

        values[key].forEach(item => {
          keys2[item.id] = item;
        });

        node[key].forEach(item => {
          const obj = keys2[item.id];
          if (!obj) {
            deleted.push({ id: item.id });
          } else {
            if (!isEqual(obj, item)) {
              update.push({ where: { id: obj.id }, data: pickInputFields(value.type[0], obj) });
            }
          }
        });

        values[key].forEach(item => {
          if (!keys1[item.id]) {
            create.push(pickInputFields(value.type[0], item));
          }
        });

        //console.log('created: ', create);
        //console.log('updated: ', update);
        //console.log('deleted: ', deleted);

        inputValues[key] = { create, update, delete: deleted };
      }
    }
  }

  //console.log('inputValues:', inputValues);

  return inputValues;
};
