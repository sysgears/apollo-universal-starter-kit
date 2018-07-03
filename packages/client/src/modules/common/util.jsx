import React from 'react';
import { pick, capitalize } from 'lodash';
import Field from '../../utils/FieldAdapter';
import { RenderField, RenderSwitch, RenderSelectQuery } from './components/native';

export const createFormFields = (schema, values, setFieldValue) => {
  let fields = [];
  for (const key of schema.keys()) {
    const value = schema.values[key];
    const type = Array.isArray(value.type) ? value.type[0] : value.type;
    const hasTypeOf = targetType => type === targetType || type.prototype instanceof targetType;
    const inputStyle = { fontSize: 16 };
    const switchStyle = {
      itemTitle: {
        fontSize: 16
      }
    };
    if (key === 'id') {
      continue;
    }
    if (type.isSchema) {
      fields.push(
        <Field
          schema={type}
          label={capitalize(key)}
          name={key}
          key={key}
          value={values[key]}
          component={RenderSelectQuery}
          placeholder={capitalize(key)}
          onChange={selectedValue => setFieldValue(key, selectedValue)}
        />
      );
    } else if (hasTypeOf(String)) {
      fields.push(
        <Field
          name={key}
          key={key}
          value={values[key]}
          component={RenderField}
          type="text"
          style={inputStyle}
          placeholder={capitalize(key)}
        />
      );
    } else if (hasTypeOf(Number)) {
      fields.push(
        <Field
          keyboardType="numeric"
          name={key}
          key={key}
          value={`${values[key]}`}
          type="number"
          component={RenderField}
          style={inputStyle}
          placeholder={capitalize(key)}
        />
      );
    } else if (hasTypeOf(Boolean)) {
      fields.push(
        <Field
          label={capitalize(key)}
          name={key}
          key={key}
          value={values[key]}
          component={RenderSwitch}
          placeholder={capitalize(key)}
          onChange={selectedValue => setFieldValue(key, selectedValue)}
          style={switchStyle}
        />
      );
    }
  }

  return fields;
};

export const pickInputFields = ({ schema, values }) => {
  return pick(values, schema.keys());
};
