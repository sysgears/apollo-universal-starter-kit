/* eslint-disable react/display-name */
import React from 'react';
import { startCase } from 'lodash';
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';

import { RenderField, RenderSelect, RenderDate, RenderSwitch, Button, Popconfirm, Switch } from './components/web';
import { required } from '../../../common/validation';

export const createColumnFields = (schema, link, orderBy, renderOrderByArrow, hendleDelete) => {
  let columns = [];

  for (const key of schema.keys()) {
    const value = schema.values[key];
    if (value.show !== false) {
      if (key === 'id') {
        columns.push({
          title: (
            <a onClick={e => orderBy(e, key)} href="#">
              {startCase(key)} {renderOrderByArrow(key)}
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
                {startCase(key)} {renderOrderByArrow(key)}
              </a>
            ),
            dataIndex: key,
            key: key,
            render: text => {
              return text[sortBy];
            }
          });
        } else if (value.type.name === 'Boolean') {
          columns.push({
            title: (
              <a onClick={e => orderBy(e, key)} href="#">
                {startCase(key)} {renderOrderByArrow(key)}
              </a>
            ),
            dataIndex: key,
            key: key,
            render: text => {
              return <Switch defaultChecked={text} disabled />;
            }
          });
        } else if (value.type.constructor !== Array) {
          columns.push({
            title: (
              <a onClick={e => orderBy(e, key)} href="#">
                {startCase(key)} {renderOrderByArrow(key)}
              </a>
            ),
            dataIndex: key,
            key: key
          });
        }
      }
    }
  }

  columns.push({
    title: 'Actions',
    key: 'actions',
    render: (text, record) => (
      <Popconfirm title="Sure to delete?" onConfirm={() => hendleDelete(record.id)}>
        <Button color="primary" size="sm">
          Delete
        </Button>
      </Popconfirm>
    )
  });

  return columns;
};

export const createFormFields = (schema, formdata) => {
  let fields = [];

  for (const key of schema.keys()) {
    const value = schema.values[key];

    if (key !== 'id' && value.show !== false && value.type.constructor !== Array) {
      let validate = [];
      if (!value.optional) {
        validate.push(required);
      }

      let component = RenderField;
      let data = null;

      if (value.type.isSchema) {
        component = RenderSelect;
        data = formdata[`${key}s`];
      } else {
        switch (value.type.name) {
          case 'Date':
            component = RenderDate;
            break;
          case 'Boolean':
            component = RenderSwitch;
            break;
        }
      }

      fields.push(
        <Field
          name={key}
          key={key}
          component={component}
          data={data}
          type="text"
          label={startCase(key)}
          validate={validate}
        />
      );
    } else {
      if (value.type.constructor === Array) {
        //console.log('key: ', value.type);
      }
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
      } else if (key !== 'id' && value.type.constructor !== Array) {
        inputValues[key] = values[key];
      }
    }
  }

  return inputValues;
};
