/* eslint-disable react/display-name */
import React from 'react';
import { Link } from 'react-router-dom';
import { pick, capitalize } from 'lodash';
import { Field } from 'redux-form';
import { RenderField, Button } from './components/web';

export const createTableColumns = (schema, path, hendleDelete) => {
  let columns = [];

  for (const key of schema.keys()) {
    if (key === 'id') {
      columns.push({
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => (
          <Link className="$module$-link" to={`/${path}/${record.id}`}>
            {text}
          </Link>
        )
      });
    } else {
      columns.push({
        title: key,
        dataIndex: key,
        key: key
      });
    }
  }

  columns.push({
    title: 'Actions',
    key: 'actions',
    render: (text, record) => (
      <Button color="primary" size="sm" onClick={() => hendleDelete(record.id)}>
        Delete
      </Button>
    )
  });

  return columns;
};

const required = value => (value ? undefined : 'Required');

export const createFormFields = schema => {
  let fields = [];

  for (const key of schema.keys()) {
    if (key !== 'id') {
      fields.push(
        <Field name={key} key={key} component={RenderField} type="text" label={capitalize(key)} validate={[required]} />
      );
    }
  }

  return fields;
};

export const pickInputFields = (schema, values) => {
  return pick(values, schema.keys());
};
