/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { startCase, round } from 'lodash';
import { Link } from 'react-router-dom';
import { FieldArray } from 'formik';
import moment from 'moment';
import DomainSchema from '@domain-schema/core';

import { hasRole } from '../user/containers/Auth';
import Field from '../../utils/FieldAdapter';
import { mapFormPropsToValues } from '../../utils/crud';
import {
  RenderField,
  RenderNumber,
  RenderTextArea,
  RenderSelectQuery,
  RenderSelectCountry,
  RenderDate,
  RenderSwitch,
  Popconfirm,
  Switch,
  InputNumber,
  Icon,
  Button,
  FormItem,
  Col,
  Input,
  DatePicker,
  RenderCellSelectQuery
} from './components/web';

const dateFormat = 'YYYY-MM-DD';

export const createColumnFields = ({
  schema,
  link,
  currentUser,
  orderBy,
  renderOrderByArrow,
  handleUpdate,
  handleDelete,
  onCellChange,
  customFields = {},
  customActions
}) => {
  let columns = [];

  const keys =
    customFields.constructor === Object && Object.keys(customFields).length !== 0
      ? Object.keys(customFields)
      : schema.keys();

  for (const key of keys) {
    const role = customFields && customFields[key] && customFields[key].role ? customFields[key].role : false;

    const hasRole =
      currentUser && (!role || (Array.isArray(role) ? role : [role]).indexOf(currentUser.role) >= 0) ? true : false;

    if (schema.values[key]) {
      const value = schema.values[key];
      const hasTypeOf = targetType =>
        value.type === targetType || value.type.prototype instanceof targetType || value.type instanceof targetType;
      const title = (
        <a onClick={e => orderBy(e, key)} href="#">
          {startCase(key)} {renderOrderByArrow(key)}
        </a>
      );

      if (hasRole && value.show !== false && (key !== 'id' || customFields['id'])) {
        if (value.type.isSchema) {
          let column = 'name';
          for (const remoteKey of value.type.keys()) {
            const remoteValue = value.type.values[remoteKey];
            if (remoteValue.sortBy) {
              column = remoteKey;
            }
          }
          const toString = value.type.__.__toString ? value.type.__.__toString : opt => opt[column];

          columns.push(
            createColumnField(
              key,
              customFields,
              (text, record) =>
                customFields[key] && customFields[key]['render'] ? (
                  customFields[key]['render'](text, record)
                ) : (
                  <EditableCell
                    value={text}
                    hasTypeOf={hasTypeOf}
                    schema={value.type}
                    record={record}
                    role={customFields[key] && customFields[key]['editRole'] ? customFields[key]['editRole'] : null}
                    currentUser={currentUser}
                    render={
                      customFields[key] && customFields[key]['render']
                        ? customFields[key]['render']
                        : text => (text && text[column] ? toString(text) : '')
                    }
                    onChange={onCellChange(`${key}Id`, record.id, handleUpdate)}
                  />
                ),
              title
            )
          );
        } else if (hasTypeOf(Boolean)) {
          columns.push(
            createColumnField(
              key,
              customFields,
              (text, record) => {
                const data = {};
                data[key] = !text;
                return <Switch checked={text} onClick={() => handleUpdate(data, record.id)} onChange={() => {}} />;
              },
              title
            )
          );
        } else if ((hasTypeOf(String) || hasTypeOf(Number) || hasTypeOf(Date)) && key !== 'id') {
          columns.push(
            createColumnField(
              key,
              customFields,
              (text, record) => {
                let formatedText = text => text;
                if (value.fieldInput === 'price') {
                  formatedText = text => (text > 0 ? `${round(text, 2).toFixed(2)} €` : '');
                }
                return (
                  <EditableCell
                    value={text}
                    hasTypeOf={hasTypeOf}
                    role={customFields[key] && customFields[key]['editRole'] ? customFields[key]['editRole'] : null}
                    currentUser={currentUser}
                    render={
                      customFields[key] && customFields[key]['render'] ? customFields[key]['render'] : formatedText
                    }
                    onChange={onCellChange(key, record.id, handleUpdate)}
                  />
                );
              },
              title
            )
          );
        } else if (value.type.constructor !== Array) {
          columns.push(
            createColumnField(
              key,
              customFields,
              (text, record) => {
                return customFields[key] && customFields[key]['render']
                  ? customFields[key]['render'](text, record)
                  : customFields[key] && customFields[key]['render']
                    ? customFields[key]['render'](text, record)
                    : text;
              },
              title
            )
          );
        }
      }
    } else {
      if (hasRole) {
        columns.push(
          createColumnField(
            key,
            customFields,
            (text, record) =>
              customFields[key] && customFields[key]['render'] ? customFields[key]['render'](text, record) : null,
            startCase(key)
          )
        );
      }
    }
  }

  const showColumnActions =
    customActions === null
      ? false
      : customActions && customActions.role
        ? !!hasRole(customActions.role, currentUser)
        : true;

  if (showColumnActions) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (text, record) => {
        return (
          <div>
            <Link className="link" to={`/${link}/${record.id}`} key="edit">
              <Button color="primary" size="sm">
                Edit
              </Button>
            </Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.id)}
              key="delete"
              target={`delete-button-${record.id}`}
              className={'bootstrap-cell-delete-button'}
            >
              <Button color="primary" size="sm">
                Delete
              </Button>
            </Popconfirm>
          </div>
        );
      }
    });
  }
  return columns;
};

const createColumnField = (key, customFields, render, title) => {
  return {
    title: title,
    dataIndex: key,
    key: key,
    fixed: customFields[key] && customFields[key]['fixed'] ? customFields[key]['fixed'] : null,
    width: customFields[key] && customFields[key]['width'] ? customFields[key]['width'] : null,
    align: customFields[key] && customFields[key]['align'] ? customFields[key]['align'] : null,
    render: render
  };
};

export const createFormFields = ({
  handleChange,
  handleBlur,
  schema,
  values = {},
  formItemLayout,
  prefix = '',
  customFields = {},
  formType = 'form'
}) => {
  let fields = [];
  // use customFields if definded otherwise use schema.keys()
  const keys =
    customFields.constructor === Object && Object.keys(customFields).length !== 0
      ? Object.keys(customFields)
      : schema.keys();

  for (const key of keys) {
    const value = schema.values[key];
    const typeIsArray = Array.isArray(value.type);
    const type = typeIsArray ? value.type[0] : value.type;
    const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;

    if (value.show !== false && !typeIsArray) {
      let formField = createFormField(key, type, values, formItemLayout, formType, hasTypeOf, prefix);
      if (formField) {
        if (Array.isArray(formField)) {
          formField.forEach(field => fields.push(field));
        } else {
          fields.push(formField);
        }
      }
    } else if (typeIsArray && type && formType === 'form') {
      fields.push(createFormField(key, type, values, formItemLayout, formType, hasTypeOf, prefix));
    } else if (typeIsArray && formType === 'nested') {
      if (values[key]) {
        fields.push(createFormFieldsArray(key, values, value, type, handleChange, handleBlur, formItemLayout));
      }
    }
  }

  return fields;
};

const createFormField = (key, type, values, formItemLayout, formType, hasTypeOf, prefix) => {
  let component = RenderField;
  const value = values ? values[key] : '';
  let style = {};
  let dateFields = [];
  let inputType = 'text';

  if (key === 'id' && formType !== 'filter') {
    return false;
  }

  if (type.isSchema) {
    component = RenderSelectQuery;
    if (formType === 'batch') {
      style = { width: 100 };
    }
  } else if (hasTypeOf(Boolean)) {
    component = RenderSwitch;
  } else if (hasTypeOf(Date)) {
    component = RenderDate;
    if (formType === 'filter') {
      dateFields.push(
        <Col span={8} key={`${key}_lte`}>
          <Field
            name={`${prefix}${key}_lte`}
            key={`${key}_lte`}
            component={component}
            schema={type}
            value={values[`${key}_lte`] ? values[`${key}_lte`] : ''}
            type={inputType}
            style={style}
            label={`From ${startCase(key)}`}
            formItemLayout={formItemLayout}
            formType={formType}
            hasTypeOf={hasTypeOf}
          />
        </Col>
      );
      dateFields.push(
        <Col span={8} key={`${key}_gte`}>
          <Field
            name={`${prefix}${key}_gte`}
            key={`${key}_gte`}
            component={component}
            schema={type}
            value={values[`${key}_gte`] ? values[`${key}_gte`] : ''}
            type={inputType}
            style={style}
            label={`To ${startCase(key)}`}
            formItemLayout={formItemLayout}
            formType={formType}
            hasTypeOf={hasTypeOf}
          />
        </Col>
      );
    }
  } else if (hasTypeOf(Number)) {
    inputType = 'number';
    component = RenderNumber;
  } else if (hasTypeOf(String) && value.fieldInput === 'textarea' && formType !== 'filter') {
    component = RenderTextArea;
  } else if (hasTypeOf(String) && value.fieldInput === 'country' && formType !== 'filter') {
    component = RenderSelectCountry;
  }

  let field = (
    <Field
      name={`${prefix}${key}`}
      key={key}
      component={component}
      schema={type}
      value={value}
      type={inputType}
      style={style}
      label={startCase(key)}
      formItemLayout={formItemLayout}
      formType={formType}
      hasTypeOf={hasTypeOf}
    />
  );

  return dateFields.length === 2 ? (
    dateFields
  ) : formType === 'filter' ? (
    <Col span={8} key={key}>
      {field}
    </Col>
  ) : (
    field
  );
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 6
    }
  }
};

const createFormFieldsArray = (key, values, value, type, handleChange, handleBlur, formItemLayout) => {
  return (
    <FieldArray
      name={key}
      key={key}
      render={({ push, remove }) => {
        return (
          <FormItem {...formItemLayout} label={startCase(key)}>
            {values[key].map((field, index) => (
              <div key={index} className="field-array-form">
                {createFormFields({
                  handleChange,
                  handleBlur,
                  schema: type,
                  values: mapFormPropsToValues({ schema: type, data: field }),
                  formItemLayout: formItemLayout,
                  prefix: `${key}[${index}].`
                })}
                {!value.hasOne && (
                  <FormItem {...tailFormItemLayout}>
                    <Button color="primary" size="sm" onClick={() => remove(index)}>
                      Delete
                    </Button>
                  </FormItem>
                )}
              </div>
            ))}
            {!value.hasOne && (
              <FormItem {...tailFormItemLayout}>
                <Button color="dashed" onClick={() => push({})} style={{ width: '180px' }}>
                  Add field
                </Button>
              </FormItem>
            )}
          </FormItem>
        );
      }}
    />
  );
};

class EditableCell extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    record: PropTypes.object,
    role: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    currentUser: PropTypes.object,
    render: PropTypes.func,
    hasTypeOf: PropTypes.func,
    schema: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  state = {
    value: this.props.value,
    searchText: '',
    dirty: false,
    editable: false
  };
  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    if (nextProps.value !== value) {
      this.setState({ value: nextProps.value });
    }
  }
  handleChange = e => {
    const value = e.target.value;
    this.setState({ value });
  };
  handleNumberChange = e => {
    let value = e;
    if (e.target) {
      value = e.target.value;
    }
    this.setState({ value });
  };
  handleDateChange = (date, dateString) => {
    if (moment(date).isValid()) {
      return this.setState({ value: moment(date).format(dateFormat) });
    }
    this.setState({ value: dateString });
  };
  handleSelectChange = (value, edges) => {
    this.setState({ value: edges.find(item => item.id === parseInt(value.key)) || '' });
  };
  check = () => {
    const { hasTypeOf } = this.props;

    this.setState({ editable: false });
    if (this.props.onChange) {
      if (hasTypeOf(DomainSchema)) {
        this.props.onChange(this.state.value.id);
      } else {
        this.props.onChange(this.state.value);
      }
    }
  };
  search = value => {
    const { dirty } = this.state;
    if ((value && value.length >= 2) || dirty) {
      this.setState({ searchText: value, dirty: true });
    }
  };
  edit = () => {
    this.setState({ editable: true });
  };
  render() {
    const { value, record, searchText, dirty, editable } = this.state;
    const { render, hasTypeOf, schema, role, currentUser } = this.props;

    if (role) {
      const hasRole =
        currentUser && (!role || (Array.isArray(role) ? role : [role]).indexOf(currentUser.role) >= 0) ? true : false;

      if (!hasRole) {
        return render(value, record);
      }
    }
    let input = null;
    if (hasTypeOf(DomainSchema)) {
      input = (
        <RenderCellSelectQuery
          searchText={searchText}
          value={value}
          schema={schema}
          handleOnChange={this.handleSelectChange}
          handleSearch={this.search}
          dirty={dirty}
        />
      );
    } else if (editable) {
      let formatedValue = value;
      input = <Input value={formatedValue} onChange={this.handleChange} onPressEnter={this.check} />;
      if (hasTypeOf(Number) || hasTypeOf(DomainSchema.Float)) {
        let inputParms = {
          value: formatedValue,
          onChange: this.handleNumberChange,
          onPressEnter: this.check
        };
        if (hasTypeOf(DomainSchema.Float)) {
          inputParms = {
            step: '0.1',
            ...inputParms
          };
        }
        input = <InputNumber {...inputParms} />;
      } else if (hasTypeOf(Date)) {
        if (value !== null && value !== '') {
          formatedValue = moment(value, dateFormat);
        } else {
          formatedValue = null;
        }

        input = (
          <DatePicker
            value={formatedValue}
            format={dateFormat}
            onChange={this.handleDateChange}
            onPressEnter={this.check}
          />
        );
      }
    }
    return (
      <div className="editable-cell">
        {editable ? (
          <div className="editable-cell-input-wrapper">
            {input}
            <Icon type="check" className="editable-cell-icon-check fas fa-check" onClick={this.check} />
          </div>
        ) : (
          <div className="editable-cell-text-wrapper">
            {render(value, record) || '\u00A0'}
            <Icon type="edit" className="editable-cell-icon fas fa-pencil-alt" onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}
