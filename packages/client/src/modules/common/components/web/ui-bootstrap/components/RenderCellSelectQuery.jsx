import React from 'react';
import PropTypes from 'prop-types';
import { pascalize } from 'humps';
import { Select, Spin } from './index';
import schemaQueries from '../../commonGraphql';

export default class RenderCellSelectQuery extends React.Component {
  static propTypes = {
    schema: PropTypes.object,
    value: PropTypes.object,
    searchText: PropTypes.any,
    handleOnChange: PropTypes.func.isRequired,
    style: PropTypes.object,
    dirty: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e, edges) => {
    let selectedItem = edges && Array.isArray(edges) ? edges.find(item => item.id == e.target.value) : '';
    this.props.handleOnChange(selectedItem ? { key: selectedItem.id, label: selectedItem.name } : '');
  };

  render() {
    const { value, schema, searchText, style } = this.props;

    const pascalizeSchemaName = pascalize(schema.name);

    let orderBy = null;
    for (const remoteKey of schema.keys()) {
      if (remoteKey === 'rank') {
        orderBy = {
          column: 'rank'
        };
      }
    }

    let formatedValue = value && value != '' && typeof value !== 'undefined' ? value.id : '';

    const Query = schemaQueries[`${pascalizeSchemaName}Query`];

    let defaultStyle = { width: '80%' };
    if (style) {
      defaultStyle = style;
    }

    return (
      <Query limit={10} filter={{ searchText }} orderBy={orderBy}>
        {({ loading, data }) => {
          if (!loading || data) {
            let options = data.edges
              ? data.edges.map(opt => (
                  <option key={opt.id} value={opt.id.toString()} label={opt.name}>
                    {opt.name}
                  </option>
                ))
              : null;
            if (!value && data.edges && data.edges.length > 0) {
              options.unshift(
                <option key="0" value="0">
                  Select Item
                </option>
              );
            }
            let props = {
              style: defaultStyle,
              value: formatedValue,
              onChange: e => this.handleChange(e, data.edges)
            };
            return (
              <Select type="select" {...props}>
                {options}
              </Select>
            );
          } else {
            return <Spin size="small" />;
          }
        }}
      </Query>
    );
  }
}
