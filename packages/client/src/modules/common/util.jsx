import React from 'react';
import { pick, capitalize } from 'lodash';
import Field from '../../utils/FieldAdapter';
import { RenderField, RenderSwitch } from './components/native';

export const createFormFields = (schema, values, setFieldValue) => {
  let fields = [];
  for (const key of schema.keys()) {
    const value = Array.isArray(schema.values[key]) ? schema.values[key][0] : schema.values[key];
    const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;
    if (key === 'id') {
      continue;
    }
    if (hasTypeOf(Boolean)) {
      fields.push(
        <Field
          label={capitalize(key)}
          name={key}
          key={key}
          value={values[key]}
          component={RenderSwitch}
          placeholder={capitalize(key)}
          onValueChange={val => setFieldValue(key, val)}
        />
      );
    } else if (hasTypeOf(String)) {
      fields.push(
        <Field
          label={capitalize(key)}
          name={key}
          key={key}
          value={values[key]}
          type="text"
          component={RenderField}
          placeholder={capitalize(key)}
        />
      );
    } else if (hasTypeOf(Number)) {
      fields.push(
        <Field
          keyboardType="numeric"
          label={capitalize(key)}
          name={key}
          key={key}
          value={`${values[key]}`}
          type="number"
          component={RenderField}
          placeholder={capitalize(key)}
        />
      );
    }
  }

  return fields;
};

export const pickInputFields = ({ schema, values }) => {
  return pick(values, schema.keys());
};
