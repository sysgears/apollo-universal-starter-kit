import React from 'react';
import PropTypes from 'prop-types';
import { Select, Spin } from 'antd';
import { pascalize } from 'humps';
import { FormItem } from './index';
import schemaQueries from '../../commonGraphql';

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

  handleChange = (value, edges) => {
    const {
      input: { name },
      setFieldValue
    } = this.props;

    let selectedValue = '';
    if (edges && Array.isArray(edges) && edges.length > 0 && value) {
      selectedValue = edges.find(item => item.id === Number(value.key));
    }

    setFieldValue(name, selectedValue);
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

    const Query = schemaQueries[`${pascalizeSchemaName}Query`];

    let defaultStyle = { width: '100%' };
    if (style) {
      defaultStyle = style;
    }

    let defaultValue = 'defaultValue';
    if (formType === 'filter' || formType === 'batch') {
      defaultValue = 'value';
    }

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={error}>
        <div>
          <Query limit={10} filter={{ searchText }} orderBy={orderBy}>
            {({ loading, data }) => {
              if (!loading || data) {
                const options = data.edges
                  ? data.edges.map(opt => {
                      return (
                        <Option key={opt.id} value={opt.id.toString()}>
                          {toString(opt)}
                        </Option>
                      );
                    })
                  : null;

                let props = {
                  allowClear: formType !== 'form' ? true : false,
                  showSearch: true,
                  labelInValue: true,
                  dropdownMatchSelectWidth: false,
                  style: defaultStyle,
                  onChange: value => this.handleChange(value, data.edges ? data.edges : null),
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
