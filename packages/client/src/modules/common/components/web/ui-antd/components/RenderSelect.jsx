import React from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import Spin from 'antd/lib/spin';
import { pascalize, camelize } from 'humps';

import { FormItem } from './index';

const Option = Select.Option;

export default class RenderSelect extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
    formItemLayout: PropTypes.object,
    meta: PropTypes.object,
    schemaName: PropTypes.string,
    style: PropTypes.object
  };

  state = {
    searchText: '',
    dirty: false
  };

  handleChange = ({ key, label }) => {
    const { input: { onChange, name } } = this.props;
    //console.log('RenderSelect: handleChange');
    //console.log('name:', name);
    //console.log('key:', key);
    //console.log('label:', label);
    onChange(name, { id: key, name: label });
  };

  search = value => {
    const { dirty } = this.state;
    //onsole.log('search:', value);
    if ((value && value.length >= 2) || dirty) {
      this.setState({ searchText: value, dirty: true });
    }
  };

  render() {
    const {
      input: { value, onChange, ...inputRest },
      label,
      schemaName,
      style,
      formItemLayout,
      meta: { touched, error }
    } = this.props;
    const { searchText, dirty } = this.state;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

    const camelizeSchemaName = camelize(schemaName);
    const pascalizeSchemaName = pascalize(schemaName);
    let formatedValue =
      value && value != '' && value != undefined
        ? { key: value.id.toString(), label: value.name }
        : { key: '', label: '' };

    // eslint-disable-next-line import/no-dynamic-require
    const Query = require(`../../../../../${camelizeSchemaName}/containers/${pascalizeSchemaName}Query`)['default'];
    //console.log(`../../../../../${camelizeSchemaName}/containers/${pascalizeSchemaName}Query`);

    let defaultStyle = { width: '100%' };
    if (style) {
      defaultStyle = style;
    }
    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={error}>
        <div>
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
                  style: defaultStyle,
                  onChange: this.handleChange,
                  ...inputRest,
                  defaultValue: formatedValue
                };

                if (data.pageInfo.totalCount > 10) {
                  if (data.edges && value && value != '' && value != undefined) {
                    if (!data.edges.find(node => node.id === value.id)) {
                      if (!dirty) {
                        options.unshift(
                          <Option key={value.id} value={value.id.toString()}>
                            {value.name}
                          </Option>
                        );
                      } else {
                        formatedValue = { key: data.edges[0].id.toString(), label: data.edges[0].name };
                      }
                    }
                  }

                  props = {
                    ...props,
                    filterOption: false,
                    defaultValue: formatedValue,
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
        </div>
      </FormItem>
    );
  }
}
