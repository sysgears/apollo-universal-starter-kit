import React from 'react';
import PropTypes from 'prop-types';
import { Select, Spin } from 'antd';
import { pascalize, camelize } from 'humps';

import { FormItem } from './index';

const Option = Select.Option;

export default class RenderSelectQuery extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    label: PropTypes.string,
    formItemLayout: PropTypes.object,
    meta: PropTypes.object,
    schema: PropTypes.object,
    style: PropTypes.object,
    formType: PropTypes.string.isRequired
  };

  state = {
    searchText: '',
    dirty: false
  };

  handleChange = value => {
    const {
      input: { name },
      setFieldValue
    } = this.props;
    //console.log('RenderSelect: handleChange');
    //console.log('name:', name);
    //console.log('value:', value);
    setFieldValue(name, value ? { id: value.key, name: value.label } : undefined);
  };

  handleBlur = () => {
    const {
      input: { name },
      setFieldTouched
    } = this.props;
    setFieldTouched(name, true);
  };

  search = value => {
    const { dirty } = this.state;
    //onsole.log('search:', value);
    if ((value && value.length >= 1) || dirty) {
      this.setState({ searchText: value, dirty: true });
    }
  };

  render() {
    const {
      input: { value, onChange, onBlur, ...inputRest },
      label,
      schema,
      style,
      formItemLayout,
      meta: { touched, error },
      formType
    } = this.props;
    const { searchText, dirty } = this.state;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

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

    let formatedValue =
      value && value != '' && value != undefined
        ? { key: value.id.toString(), label: toString(value) }
        : { key: '', label: '' };
    //console.log('formatedValue:', formatedValue);

    // eslint-disable-next-line import/no-dynamic-require
    const Query = require(`../../../../../${camelizeSchemaName}/containers/${pascalizeSchemaName}Query`)['default'];
    //console.log(`../../../../../${camelizeSchemaName}/containers/${pascalizeSchemaName}Query`);

    let defaultStyle = { width: '100%' };
    if (style) {
      defaultStyle = style;
    }

    let defaultValue = 'defaultValue';
    if (formType === 'filter') {
      defaultValue = 'value';
    }

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={error}>
        <div>
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
                  allowClear: formType !== 'form' ? true : false,
                  showSearch: true,
                  labelInValue: true,
                  dropdownMatchSelectWidth: false,
                  style: defaultStyle,
                  onChange: this.handleChange,
                  onBlur: this.handleBlur,
                  ...inputRest,
                  [defaultValue]: formatedValue
                };

                if (data.pageInfo.totalCount > 10) {
                  if (data.edges && value && value != '' && value != undefined) {
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
                    [defaultValue]: formatedValue,
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
        </div>
      </FormItem>
    );
  }
}
