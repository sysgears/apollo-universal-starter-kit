import React from 'react';
import PropTypes from 'prop-types';
import { Select, Spin } from 'antd';
import { pascalize } from 'humps';
import schemaQueries from '../../../../generatedContainers';

const Option = Select.Option;
export default class RenderCellSelectQuery extends React.Component {
  static propTypes = {
    schema: PropTypes.object,
    value: PropTypes.object,
    searchText: PropTypes.any,
    handleOnChange: PropTypes.func.isRequired,
    style: PropTypes.object,
    dirty: PropTypes.any
  };

  handleChange = (value, data) => {
    this.props.handleOnChange(value, data);
  };

  render() {
    const { value, schema, style, searchText, dirty } = this.props;

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
    let defaultValue = 'value';
    return (
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
              style: defaultStyle,
              onChange: value => this.handleChange(value, data.edges ? data.edges : null),
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
                filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
