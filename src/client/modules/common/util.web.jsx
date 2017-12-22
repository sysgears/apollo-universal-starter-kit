/* eslint-disable react/display-name */
import React from 'react';
import { capitalize } from 'lodash';
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';

import { RenderField, RenderSelect, Button } from './components/web';
import { required } from '../../../common/validation';

export const createColumnFields = (schema, link, orderBy, renderOrderByArrow) => {
  let columns = [];

  for (const key of schema.keys()) {
    if (key === 'id') {
      columns.push({
        title: (
          <a onClick={e => orderBy(e, key)} href="#">
            {capitalize(key)} {renderOrderByArrow(key)}
          </a>
        ),
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => (
          <Link className="link" to={`/${link}/${record.id}`}>
            {text}
          </Link>
        )
      });
    } else {
      const value = schema.values[key];
      if (value.type.isSchema) {
        let sortBy = 'name';
        for (const remoteKey of value.type.keys()) {
          const remoteValue = value.type.values[remoteKey];
          if (remoteValue.sortBy) {
            sortBy = remoteKey;
          }
        }
        columns.push({
          title: (
            <a onClick={e => orderBy(e, key)} href="#">
              {capitalize(key)} {renderOrderByArrow(key)}
            </a>
          ),
          dataIndex: key,
          key: key,
          render: text => {
            return text[sortBy];
          }
        });
      } else if (value.type.constructor !== Array) {
        columns.push({
          title: (
            <a onClick={e => orderBy(e, key)} href="#">
              {capitalize(key)} {renderOrderByArrow(key)}
            </a>
          ),
          dataIndex: key,
          key: key
        });
      }
    }
  }

  columns.push({
    title: 'Actions',
    key: 'actions',
    render: (text, record) => (
      <Button color="primary" size="sm" onClick={() => this.hendleDelete(record.id)}>
        Delete
      </Button>
    )
  });

  return columns;
};

export const createFormFields = (schema, formdata) => {
  let fields = [];

  for (const key of schema.keys()) {
    const value = schema.values[key];
    if (key !== 'id' && value.type.constructor !== Array) {
      let validate = [];
      if (!value.optional) {
        validate.push(required);
      }

      let component = RenderField;
      let data = null;
      if (value.type.isSchema) {
        component = RenderSelect;
        data = formdata[`${key}s`];
      }
      fields.push(
        <Field
          name={key}
          key={key}
          component={component}
          data={data}
          type="text"
          label={capitalize(key)}
          validate={validate}
        />
      );
    }
  }

  return fields;
};

export const pickInputFields = (schema, values) => {
  let inputValues = {};

  for (const key of schema.keys()) {
    if (key in values) {
      const value = schema.values[key];
      if (value.type.isSchema) {
        inputValues[`${key}Id`] = Number(values[key].id ? values[key].id : values[key]);
      } else if (value.type.constructor !== Array) {
        inputValues[key] = values[key];
      }
    }
  }

  return inputValues;
};
