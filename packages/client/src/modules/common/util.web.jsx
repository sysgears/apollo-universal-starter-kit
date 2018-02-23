/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import { pascalize, camelize } from 'humps';
import { Link } from 'react-router-dom';
import { FieldArray } from 'formik';
import Select from 'antd/lib/select';
import DatePicker from 'antd/lib/date-picker';
import Spin from 'antd/lib/spin';
import moment from 'moment';
import DomainSchema from '@domain-schema/core';

import Field from '../../utils/FieldAdapter';
import {
  RenderField,
  RenderSelect,
  RenderDate,
  RenderSwitch,
  Button,
  Popconfirm,
  Switch,
  FormItem,
  Row,
  Col,
  Input,
  Icon
} from './components/web';

const dateFormat = 'YYYY-MM-DD';

export const createColumnFields = (
  schema,
  link,
  orderBy,
  renderOrderByArrow,
  hendleUpdate,
  hendleDelete,
  onCellChange,
  customTableColumns
) => {
  let columns = [];

  for (const key of schema.keys()) {
    const value = schema.values[key];
    const hasTypeOf = targetType =>
      value.type === targetType || value.type.prototype instanceof targetType || value.type instanceof targetType;
    //console.log(key);
    //console.log(hasTypeOf(DomainSchema));
    if (value.show !== false && (key !== 'id' || customTableColumns['id'])) {
      if (value.type.isSchema) {
        //console.log(value.type);

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
          width: 300,
          render: (text, record) =>
            customTableColumns[key] && customTableColumns[key]['render'] ? (
              customTableColumns[key]['render'](text, record)
            ) : (
              <EditableCell
                value={text}
                hasTypeOf={hasTypeOf}
                schemaName={value.type.name}
                record={record}
                render={
                  customTableColumns[key] && customTableColumns[key]['render']
                    ? customTableColumns[key]['render']
                    : text => text[sortBy]
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
          width: 100,
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
          render: (text, record) => (
            <EditableCell
              value={text}
              hasTypeOf={hasTypeOf}
              render={
                customTableColumns[key] && customTableColumns[key]['render']
                  ? customTableColumns[key]['render']
                  : text => text
              }
              onChange={onCellChange(key, record.id, hendleUpdate)}
            />
          )
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
          render: (text, record) =>
            customTableColumns[key] && customTableColumns[key]['render']
              ? customTableColumns[key]['render'](text, record)
              : customTableColumns[key] && customTableColumns[key]['render']
                ? customTableColumns[key]['render'](text, record)
                : text
        });
      }
    }
  }

  columns.push({
    title: 'Actions',
    key: 'actions',
    width: 150,
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

export const mapFormPropsToValues = (schema, formdata) => {
  let fields = {};
  for (const key of schema.keys()) {
    const value = schema.values[key];
    if (key !== 'id' && value.show !== false && value.type.constructor !== Array) {
      fields[key] = formdata ? formdata[key] : '';
    } else if (value.type.constructor === Array) {
      fields[key] = formdata ? formdata[key] : [];
    }
  }

  return fields;
};

export const createFormFields = (
  handleChange,
  setFieldValue,
  handleBlur,
  setFieldTouched,
  schema,
  values = {},
  formItemLayout,
  prefix = '',
  batch = false
) => {
  let fields = [];

  for (const key of schema.keys()) {
    const value = schema.values[key];
    const type = value.type.constructor === Array ? value.type[0] : value.type;

    const hasTypeOf = targetType => value.type === targetType || value.type.prototype instanceof targetType;

    if (key !== 'id' && value.show !== false && value.type.constructor !== Array) {
      //let validate = [];
      //if (!value.optional && !batch) {
      //  validate.push(required);
      //}

      let component = RenderField;
      const value = values ? values[key] : '';
      let onChange = handleChange;
      let onBlur = handleBlur;
      let style = {};

      if (type.isSchema) {
        component = RenderSelect;
        onChange = setFieldValue;
        onBlur = setFieldTouched;
        if (batch) {
          style = { width: 100 };
        }
      } else if (hasTypeOf(Boolean)) {
        component = RenderSwitch;
        onChange = setFieldValue;
        onBlur = setFieldTouched;
      } else if (hasTypeOf(Date)) {
        component = RenderDate;
        onChange = setFieldValue;
        onBlur = setFieldTouched;
      }

      fields.push(
        <Field
          name={`${prefix}${key}`}
          key={key}
          component={component}
          schemaName={type.name}
          value={value}
          type="text"
          style={style}
          label={startCase(key)}
          //validate={validate}
          formItemLayout={formItemLayout}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
    } else {
      if (value.type.constructor === Array && !batch) {
        if (values[key]) {
          fields.push(
            <FieldArray
              name={key}
              key={key}
              render={({ push, remove }) => {
                return (
                  <Row>
                    <Col span={12} offset={6}>
                      {values[key].map((field, index) => (
                        <div key={index} className="field-array-form">
                          {createFormFields(
                            handleChange,
                            setFieldValue,
                            handleBlur,
                            setFieldTouched,
                            value.type[0],
                            mapFormPropsToValues(value.type[0], field),
                            formItemLayout,
                            `${key}[${index}].`
                          )}
                          <FormItem {...tailFormItemLayout}>
                            <Button color="primary" size="sm" onClick={() => remove(index)}>
                              Delete
                            </Button>
                          </FormItem>
                        </div>
                      ))}
                      <FormItem {...tailFormItemLayout}>
                        {/*submitFailed && error && <span>{error}</span>*/}
                        <Button color="dashed" onClick={() => push({})} style={{ width: '180px' }}>
                          Add field
                        </Button>
                      </FormItem>
                    </Col>
                  </Row>
                );
              }}
            />
          );
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
    render: PropTypes.func,
    hasTypeOf: PropTypes.func,
    schemaName: PropTypes.string,
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
  handleDateChange = (date, dateString) => {
    this.setState({ value: dateString });
  };
  handleSelectChange = ({ key, label }) => {
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
    const { render, hasTypeOf, schemaName } = this.props;

    let input = null;
    if (editable) {
      let formatedValue = value;
      //console.log(value);
      input = <Input value={formatedValue} onChange={this.handleChange} onPressEnter={this.check} />;
      if (hasTypeOf(Date)) {
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
        const camelizeSchemaName = camelize(schemaName);
        const pascalizeSchemaName = pascalize(schemaName);

        let formatedValue = { key: value.id.toString(), label: value.name };
        // eslint-disable-next-line import/no-dynamic-require
        const Query = require(`../${camelizeSchemaName}/containers/${pascalizeSchemaName}Query`)['default'];

        input = (
          <Query limit={10} filter={{ searchText }}>
            {({ loading, data }) => {
              if (!loading || data) {
                const options = data.edges
                  ? data.edges.map(opt => (
                      <Option key={opt.id} value={opt.id.toString()}>
                        {opt.name}
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
                            {value.name}
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
                return React.createElement(Select, props, options);
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
