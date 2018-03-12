import React from 'react';
import { pick, capitalize } from 'lodash';
import Field from '../../utils/FieldAdapter';
import { RenderField } from './components/native';

export const createFormFields = schema => {
  let fields = [];

  for (const key of schema.keys()) {
    if (key !== 'id') {
      fields.push(<Field name={key} key={key} component={RenderField} type="text" label={capitalize(key)} />);
    }
  }

  return fields;
};

export const pickInputFields = ({ schema, values }) => {
  return pick(values, schema.keys());
};
