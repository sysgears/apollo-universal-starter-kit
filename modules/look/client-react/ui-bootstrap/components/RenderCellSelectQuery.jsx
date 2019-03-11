import React from 'react';
import PropTypes from 'prop-types';
import { pascalize } from 'humps';
import { Select, Spin } from './index';
import schemaQueries from '../../generatedContainers';

const LIMIT = 20;

export default class RenderCellSelectQuery extends React.Component {
  static propTypes = {
    schema: PropTypes.object,
    value: PropTypes.object,
    handleOnChange: PropTypes.func.isRequired,
    handleSearch: PropTypes.any,
    style: PropTypes.object,
    dirty: PropTypes.any
  };

  handleChange = edges => e => {
    let value = { key: e.target.value };
    this.props.handleOnChange(value, edges);
  };

  render() {
    const { value, schema, style = { width: '80%' } } = this.props;
    const column = schema.keys().find(key => !!schema.values[key].sortBy) || 'name';
    const orderBy = () => {
      const foundOrderBy = schema.keys().find(key => !!schema.values[key].orderBy);
      return foundOrderBy ? { column: foundOrderBy } : null;
    };
    const toString = schema.__.__toString ? schema.__.__toString : opt => opt[column];
    const formattedValue = value ? value.id : '0';
    const Query = schemaQueries[`${pascalize(schema.name)}Query`];

    return (
      <Query limit={LIMIT} orderBy={orderBy()}>
        {({ loading, data }) => {
          if (loading || !data) {
            return <Spin size="small" />;
          }
          const { edges } = data;
          const renderOptions = () => {
            const defaultOption = formattedValue
              ? []
              : [
                  <option key="0" value="0">
                    Select {pascalize(schema.name)}
                  </option>
                ];
            return edges
              ? edges.reduce((acc, opt) => {
                  acc.push(
                    <option key={opt.id} value={`${opt.id}`}>
                      {toString(opt)}
                    </option>
                  );
                  return acc;
                }, defaultOption)
              : defaultOption;
          };
          let props = {
            style,
            value: formattedValue,
            onChange: this.handleChange(edges || null)
          };
          return (
            <Select type="select" {...props}>
              {renderOptions()}
            </Select>
          );
        }}
      </Query>
    );
  }
}
