/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { startCase, isEqual } from 'lodash';
import { Field, FieldArray } from 'redux-form';
import { Link } from 'react-router-dom';

import { RenderField, RenderSelect, RenderDate, RenderSwitch, Button, Popconfirm, Switch } from './components/web';
import { required } from '../../../../common/validation';

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

const RenderEntry = ({ fields, formdata, schema, meta: { error, submitFailed } }) => (
  <ul>
    <li>
      <Button color="primary" size="sm" onClick={() => fields.push({})}>
        Add Entry
      </Button>
      {submitFailed && error && <span>{error}</span>}
    </li>
    {fields.map((field, index) => (
      <li key={index}>
        <Button color="primary" size="sm" onClick={() => fields.remove(index)}>
          Delete
        </Button>
        {createFormFields(schema, formdata, `${field}.`)}
      </li>
    ))}
  </ul>
);

RenderEntry.propTypes = {
  fields: PropTypes.object,
  formdata: PropTypes.object,
  schema: PropTypes.object,
  meta: PropTypes.object
};

export const createFormFields = (schema, formdata, prefix = '') => {
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
          name={`${prefix}${key}`}
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
        fields.push(
          <FieldArray name={key} key={key} component={RenderEntry} schema={value.type[0]} formdata={formdata} />
        );
      }
    }
  }

  return fields;
};

export const pickInputFields = (schema, values, node = null) => {
  let inputValues = {};

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
            create.push({ ...item });
          }
        });

        //console.log('created: ', create);
        //console.log('updated: ', update);
        //console.log('deleted: ', deleted);

        inputValues[key] = { create, update, delete: deleted };
      }
    }
  }

  return inputValues;
};
