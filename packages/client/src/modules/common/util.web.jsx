/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { startCase, round } from 'lodash';
import { pascalize, camelize } from 'humps';
import { Link } from 'react-router-dom';
import { FieldArray } from 'formik';
import { Select, DatePicker, Spin } from 'antd';
import moment from 'moment';
import DomainSchema from '@domain-schema/core';

import { hasRole } from '../user/containers/Auth';
import Field from '../../utils/FieldAdapter';
import { mapFormPropsToValues } from '../../utils/crud';
import {
  RenderInput,
  RenderNumber,
  RenderTextArea,
  RenderSelectQuery,
  RenderSelectCountry,
  RenderDate,
  RenderSwitch,
  Button,
  Popconfirm,
  Switch,
  FormItem,
  Col,
  Input,
  InputNumber,
  Icon
} from './components/web';

const dateFormat = 'YYYY-MM-DD';

export const createColumnFields = ({
  schema,
  link,
  currentUser,
  orderBy,
  renderOrderByArrow,
  hendleUpdate,
  hendleDelete,
  onCellChange,
  customFields = {},
  customActions
}) => {
  let columns = [];
  // use customFields if definded otherwise use schema.keys()
  const keys =
    customFields.constructor === Object && Object.keys(customFields).length !== 0
      ? Object.keys(customFields)
      : schema.keys();

  for (const key of keys) {
    //console.log('customFields, key: ', customFields[key]);
    const role = customFields && customFields[key] && customFields[key].role ? customFields[key].role : false;
    //console.log('customFields, role: ', role);
    const hasRole =
      currentUser && (!role || (Array.isArray(role) ? role : [role]).indexOf(currentUser.role) >= 0) ? true : false;
    //console.log('customFields, hasRole: ', hasRole);

    if (schema.values[key]) {
      const value = schema.values[key];
      const hasTypeOf = targetType =>
        value.type === targetType || value.type.prototype instanceof targetType || value.type instanceof targetType;
      //console.log(key);
      //console.log(hasTypeOf(DomainSchema));
      if (hasRole && value.show !== false && (key !== 'id' || customFields['id'])) {
        if (value.type.isSchema) {
          //console.log(value.type);

          let column = 'name';
          for (const remoteKey of value.type.keys()) {
            const remoteValue = value.type.values[remoteKey];
            if (remoteValue.sortBy) {
              column = remoteKey;
            }
          }
          const toString = value.type.__.__toString ? value.type.__.__toString : opt => opt[column];
          columns.push({
            title: (
              <a onClick={e => orderBy(e, key)} href="#">
                {startCase(key)} {renderOrderByArrow(key)}
              </a>
            ),
            dataIndex: key,
            key: key,
            fixed: customFields[key] && customFields[key]['fixed'] ? customFields[key]['fixed'] : null,
            width: customFields[key] && customFields[key]['width'] ? customFields[key]['width'] : null,
            align: customFields[key] && customFields[key]['align'] ? customFields[key]['align'] : null,
            render: (text, record) =>
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
                  onChange={onCellChange(`${key}Id`, record.id, hendleUpdate)}
                />
              )
          });
        } else if (hasTypeOf(Boolean)) {
          columns.push({
            title: (
              <a onClick={e => orderBy(e, key)} href="#">
                {startCase(key)} {renderOrderByArrow(key)}
              </a>
            ),
            dataIndex: key,
            key: key,
            fixed: customFields[key] && customFields[key]['fixed'] ? customFields[key]['fixed'] : null,
            width: customFields[key] && customFields[key]['width'] ? customFields[key]['width'] : null,
            align: customFields[key] && customFields[key]['align'] ? customFields[key]['align'] : null,
            render: (text, record) => {
              const data = {};
              data[key] = !text;
              return <Switch checked={text} onClick={() => hendleUpdate(data, record.id)} />;
            }
          });
        } else if ((hasTypeOf(String) || hasTypeOf(Number) || hasTypeOf(Date)) && key !== 'id') {
          columns.push({
            title: (
              <a onClick={e => orderBy(e, key)} href="#">
                {startCase(key)} {renderOrderByArrow(key)}
              </a>
            ),
            dataIndex: key,
            key: key,
            fixed: customFields[key] && customFields[key]['fixed'] ? customFields[key]['fixed'] : null,
            width: customFields[key] && customFields[key]['width'] ? customFields[key]['width'] : null,
            align: customFields[key] && customFields[key]['align'] ? customFields[key]['align'] : null,
            render: (text, record) => {
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
                  render={customFields[key] && customFields[key]['render'] ? customFields[key]['render'] : formatedText}
                  onChange={onCellChange(key, record.id, hendleUpdate)}
                />
              );
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
            key: key,
            fixed: customFields[key] && customFields[key]['fixed'] ? customFields[key]['fixed'] : null,
            width: customFields[key] && customFields[key]['width'] ? customFields[key]['width'] : null,
            align: customFields[key] && customFields[key]['align'] ? customFields[key]['align'] : null,
            render: (text, record) =>
              customFields[key] && customFields[key]['render']
                ? customFields[key]['render'](text, record)
                : customFields[key] && customFields[key]['render']
                  ? customFields[key]['render'](text, record)
                  : text
          });
        }
      }
    } else {
      if (hasRole) {
        columns.push({
          title: startCase(key),
          dataIndex: key,
          key: key,
          fixed: customFields[key] && customFields[key]['fixed'] ? customFields[key]['fixed'] : null,
          width: customFields[key] && customFields[key]['width'] ? customFields[key]['width'] : null,
          align: customFields[key] && customFields[key]['align'] ? customFields[key]['align'] : null,
          render: (text, record) =>
            customFields[key] && customFields[key]['render'] ? customFields[key]['render'](text, record) : null
        });
      }
    }
  }

  const showColumnActions =
    customActions === null
      ? false
      : customActions && customActions.role
        ? hasRole(customActions.role, currentUser)
          ? true
          : false
        : true;

  if (showColumnActions) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (text, record) => [
        <Link className="link" to={`/${link}/${record.id}`} key="edit">
          <Button color="primary" size="sm">
            Edit
          </Button>
        </Link>,
        <Popconfirm title="Sure to delete?" onConfirm={() => hendleDelete(record.id)} key="delete">
          <Button color="primary" size="sm">
            Delete
          </Button>
        </Popconfirm>
      ]
    });
  }

  return columns;
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
    const type = value.type.constructor === Array ? value.type[0] : value.type;

    const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;

    if (formType === 'filter') {
      if (value.show !== false && value.type.constructor !== Array) {
        //let validate = [];
        //if (!value.optional && !batch) {
        //  validate.push(required);
        //}

        let component = RenderInput;
        const value = values ? values[key] : '';
        let style = {};
        let inputType = 'text';

        if (type.isSchema) {
          component = RenderSelectQuery;
          if (formType !== 'form') {
            style = { width: 100 };
          }
          fields.push(
            <Col span={8} key={key}>
              <Field
                name={`${prefix}${key}`}
                key={key}
                component={component}
                schema={type}
                value={value}
                type={inputType}
                style={style}
                label={startCase(key)}
                //validate={validate}
                formItemLayout={formItemLayout}
                formType={formType}
                hasTypeOf={hasTypeOf}
              />
            </Col>
          );
        } else if (hasTypeOf(Boolean)) {
          component = RenderSwitch;
          fields.push(
            <Col span={8} key={key}>
              <Field
                name={`${prefix}${key}`}
                key={key}
                component={component}
                schema={type}
                value={value}
                type={inputType}
                style={style}
                label={startCase(key)}
                //validate={validate}
                formItemLayout={formItemLayout}
                formType={formType}
                hasTypeOf={hasTypeOf}
              />
            </Col>
          );
        } else if (hasTypeOf(Date)) {
          component = RenderDate;
          fields.push(
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
                //validate={validate}
                formItemLayout={formItemLayout}
                formType={formType}
                hasTypeOf={hasTypeOf}
              />
            </Col>
          );
          fields.push(
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
                //validate={validate}
                formItemLayout={formItemLayout}
                formType={formType}
                hasTypeOf={hasTypeOf}
              />
            </Col>
          );
        } else if (hasTypeOf(Number)) {
          inputType = 'number';
          component = RenderNumber;
          fields.push(
            <Col span={8} key={key}>
              <Field
                name={`${prefix}${key}`}
                key={key}
                component={component}
                schema={type}
                value={value}
                type={inputType}
                style={style}
                label={startCase(key)}
                //validate={validate}
                formItemLayout={formItemLayout}
                formType={formType}
                hasTypeOf={hasTypeOf}
              />
            </Col>
          );
        } else {
          fields.push(
            <Col span={8} key={key}>
              <Field
                name={`${prefix}${key}`}
                key={key}
                component={component}
                schema={type}
                value={value}
                type={inputType}
                style={style}
                label={startCase(key)}
                //validate={validate}
                formItemLayout={formItemLayout}
                formType={formType}
                hasTypeOf={hasTypeOf}
              />
            </Col>
          );
        }
      }
    } else {
      if (key !== 'id' && value.show !== false && value.type.constructor !== Array) {
        //let validate = [];
        //if (!value.optional && !batch) {
        //  validate.push(required);
        //}

        let component = RenderInput;
        const fieldValue = values ? values[key] : '';
        let style = {};
        let inputType = 'text';

        if (type.isSchema) {
          component = RenderSelectQuery;
          if (formType !== 'form') {
            style = { width: 100 };
          }
        } else if (hasTypeOf(Boolean)) {
          component = RenderSwitch;
        } else if (hasTypeOf(Date)) {
          component = RenderDate;
        } else if (hasTypeOf(Number)) {
          inputType = 'number';
          component = RenderNumber;
        } else if (hasTypeOf(String) && value.fieldInput === 'textarea') {
          component = RenderTextArea;
        } else if (hasTypeOf(String) && value.fieldInput === 'country') {
          component = RenderSelectCountry;
        }

        fields.push(
          <Field
            name={`${prefix}${key}`}
            key={key}
            component={component}
            schema={type}
            value={fieldValue}
            type={inputType}
            style={style}
            label={startCase(key)}
            //validate={validate}
            formItemLayout={formItemLayout}
            formType={formType}
            hasTypeOf={hasTypeOf}
          />
        );
      } else {
        if (value.type.constructor === Array && formType === 'form') {
          if (values[key]) {
            fields.push(
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
                            schema: value.type[0],
                            values: mapFormPropsToValues({ schema: value.type[0], data: field }),
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
                          {/*submitFailed && error && <span>{error}</span>*/}
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
          }
        }
      }
    }
  }

  return fields;
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
  handleNumberChange = value => {
    this.setState({ value });
  };
  handleDateChange = (date, dateString) => {
    this.setState({ value: dateString });
  };
  handleSelectChange = ({ key, label }) => {
    //console.log('EditableCell: handleSelectChange');
    //console.log('key:', key);
    //console.log('label:', label);
    this.setState({ value: { id: key, name: label } });
  };
  check = () => {
    const { hasTypeOf } = this.props;

    this.setState({ editable: false });
    if (this.props.onChange) {
      if (hasTypeOf(DomainSchema)) {
        //console.log('check:', this.state.value);
        this.props.onChange(this.state.value.id);
      } else {
        //console.log('check:', this.state.value);
        this.props.onChange(this.state.value);
      }
    }
  };
  search = value => {
    const { dirty } = this.state;
    //console.log('search:', value);
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
      //console.log('EditableCell, value:', value);
      //console.log('EditableCell, role:', role);
      //console.log('EditableCell, currentUser:', currentUser);

      const hasRole =
        currentUser && (!role || (Array.isArray(role) ? role : [role]).indexOf(currentUser.role) >= 0) ? true : false;

      if (!hasRole) {
        return render(value, record);
      }
    }
    let input = null;
    if (editable) {
      let formatedValue = value;
      //console.log('value:', value);
      input = <Input value={formatedValue} onChange={this.handleChange} onPressEnter={this.check} />;
      if (hasTypeOf(Number) || hasTypeOf(DomainSchema.Float)) {
        let inputParms = {
          value: formatedValue,
          onChange: this.handleNumberChange,
          onPressEnter: this.check
        };
        if (hasTypeOf(DomainSchema.Float)) {
          inputParms = {
            step: '0.01',
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
      } else if (hasTypeOf(DomainSchema)) {
        const Option = Select.Option;
        const camelizeSchemaName = camelize(schema.name);
        const pascalizeSchemaName = pascalize(schema.name);
        let column = 'name';
        let orderBy = null;
        for (const remoteKey of schema.keys()) {
          const remoteValue = schema.values[remoteKey];
          if (remoteValue.sortBy) {
            column = remoteKey;
          }
          if (remoteKey === 'rank') {
            orderBy = {
              column: 'rank'
            };
          }
        }
        const toString = schema.__.__toString ? schema.__.__toString : opt => opt[column];
        let formatedValue = { key: value.id.toString(), label: value.name ? value.name : value[column] };
        //console.log('formatedValue:', formatedValue);
        // eslint-disable-next-line import/no-dynamic-require
        const Query = require(`../${camelizeSchemaName}/containers/${pascalizeSchemaName}Query`)['default'];

        input = (
          <Query limit={10} filter={{ searchText }} orderBy={orderBy}>
            {({ loading, data }) => {
              if (!loading || data) {
                const options = data.edges
                  ? data.edges.map(opt => (
                      <Option key={opt.id} value={opt.id.toString()}>
                        {toString(opt)}
                      </Option>
                    ))
                  : null;

                let props = {
                  showSearch: true,
                  labelInValue: true,
                  dropdownMatchSelectWidth: false,
                  style: { width: '100%' },
                  onChange: this.handleSelectChange,
                  defaultValue: formatedValue
                };

                if (data.pageInfo.totalCount > 10) {
                  if (data.edges) {
                    if (!data.edges.find(node => node.id === value.id)) {
                      if (!dirty) {
                        options.unshift(
                          <Option key={value.id} value={value.id.toString()}>
                            {toString(value)}
                          </Option>
                        );
                      } else {
                        formatedValue = { key: data.edges[0].id.toString() };
                      }
                    }
                  }

                  props = {
                    ...props,
                    filterOption: false,
                    onSearch: this.search
                  };
                } else {
                  props = {
                    ...props,
                    optionFilterProp: 'children',
                    filterOption: (input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  };
                }
                return <Select {...props}>{options}</Select>;
              } else {
                return <Spin size="small" />;
              }
            }}
          </Query>
        );
      }
    }
    return (
      <div className="editable-cell">
        {editable ? (
          <div className="editable-cell-input-wrapper">
            {input}
            <Icon type="check" className="editable-cell-icon-check" onClick={this.check} />
          </div>
        ) : (
          <div className="editable-cell-text-wrapper">
            {render(value, record) || '\u00A0'}
            <Icon type="edit" className="editable-cell-icon" onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}
