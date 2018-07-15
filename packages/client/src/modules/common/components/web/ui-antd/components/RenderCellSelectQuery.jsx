import React from 'react';
import PropTypes from 'prop-types';
import { Select, Spin } from 'antd';
import { pascalize } from 'humps';
import schemaQueries from '../../../../generatedContainers';

const Option = Select.Option;
const LIMIT = 10;

export default class RenderCellSelectQuery extends React.Component {
  static propTypes = {
    schema: PropTypes.object,
    value: PropTypes.object,
    searchText: PropTypes.any,
    handleOnChange: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    style: PropTypes.object,
    dirty: PropTypes.any
  };

  handleChange = data => value => {
    console.log('valuevaluevaluevalue', value);
    this.props.handleOnChange(value, data);
  };

  handleSearch = () => value => this.props.handleSearch(value);

  render() {
    const { value, schema, style = { width: '100%' }, searchText, dirty } = this.props;
    const column = schema.keys().find(key => !!schema.values[key].sortBy) || 'name';
    const orderBy = () => {
      const foundOrderBy = schema.keys().find(key => !!schema.values[key].orderBy);
      return foundOrderBy ? { column: foundOrderBy } : null;
    };
    const toString = schema.__.__toString ? schema.__.__toString : opt => opt[column];
    const formattedValue = value ? { key: `${value.id}`, label: toString(value) } : { key: '', label: '' };
    const Query = schemaQueries[`${pascalize(schema.name)}Query`];

    return (
      <Query limit={LIMIT} filter={{ searchText }} orderBy={orderBy()}>
        {({ loading, data }) => {
          if (loading || !data) {
            return <Spin size="small" />;
          }
          const {
            edges,
            pageInfo: { totalCount }
          } = data;
          const isEdgesNotIncludeValue = value && edges && !edges.find(({ id }) => id === value.id);
          const renderOptions = () => {
            const defaultOption = formattedValue
              ? []
              : [
                  <Option key="0" value="0">
                    Select {pascalize(schema.name)}
                  </Option>
                ];
            return edges
              ? edges.reduce((acc, opt) => {
                  acc.push(
                    <Option key={opt.id} value={`${opt.id}`}>
                      {toString(opt)}
                    </Option>
                  );
                  return acc;
                }, defaultOption)
              : defaultOption;
          };

          const getSearchProps = () => {
            return {
              filterOption: false,
              onSearch: this.handleSearch(),
              value: isEdgesNotIncludeValue && dirty ? { key: `${edges[0].id}` } : formattedValue
            };
          };

          const getChildrenProps = () => {
            return {
              optionFilterProp: 'children',
              filterOption: (input, { props: { children } }) => children.toLowerCase().includes(input.toLowerCase()),
              value: formattedValue
            };
          };

          const basicProps = {
            showSearch: true,
            labelInValue: true,
            dropdownMatchSelectWidth: false,
            style,
            onChange: this.handleChange(edges || null)
          };
          const filterProps = totalCount > LIMIT ? getSearchProps() : getChildrenProps();
          const props = { ...basicProps, ...filterProps };
          return <Select {...props}>{renderOptions()}</Select>;
        }}
      </Query>
    );
  }
}
