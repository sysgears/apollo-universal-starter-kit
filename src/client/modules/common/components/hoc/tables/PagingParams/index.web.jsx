/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import { graphql } from 'react-apollo';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

class PagingParams extends React.Component {
  static propTypes = {
    tableProps: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    accessor: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { query, accessor } = this.props;

    let self = this;

    this.component = graphql(query, {
      options: props => {
        // console.log("querying Props", props)
        let { page, pageSize } = props;
        page = page || 0;
        pageSize = pageSize || props.defaultPageSize;
        const offset = pageSize ? pageSize * page : 0;
        // console.log("querying Users", page, offset, pageSize, filtered, sorted)
        return {
          fetchPolicy: 'cache-and-network',
          variables: {
            offset,
            limit: pageSize
          }
        };
      },
      props: ({ data }) => {
        const { loading, refetch, error, errors } = data;
        let pages = -1;
        let results = [];
        let res = accessor(data);
        if (res) {
          pages = res.pages;
          results = res.data;
        }
        const ret = { loading, pages, refetch, errors, error: error ? error.graphQLErrors : null, data: results };
        self.refetch = refetch || self.refetch;
        return ret;
      }
    })(ReactTable);
  }

  // onFetchData(args, table) {
  onFetchData(args) {
    let { loading, page, pageSize, filtered, sorted, refetch, columns, allVisibleColumns, defaultPageSize } = args;

    page = page || 0;
    const limit = pageSize || defaultPageSize;
    const offset = pageSize ? pageSize * page : 0;

    for (let col in columns) {
      columns[col].filter = null;
    }
    for (let col in allVisibleColumns) {
      allVisibleColumns[col].filter = null;
    }

    let filters = [];
    if (filtered) {
      for (let filter of filtered) {
        let f = {
          bool: 'and',
          field: filter.id,
          compare: 'like',
          value: `%${filter.value}%`
        };
        filters.push(f);

        let col = columns.findIndex(c => {
          console.log(c);
          return c.id == filter.id;
        });
        columns[col].filter = filter;
        allVisibleColumns[col].filter = filter;
      }
    }

    let orderBys = [];
    if (sorted) {
      for (let sort of sorted) {
        let o = {
          column: sort.id,
          order: sort.desc ? 'desc' : 'asc'
        };
        orderBys.push(o);
      }
    }

    const vars = {
      offset,
      limit,
      filters,
      orderBys
    };

    if (loading || !refetch) {
      return;
    }
    refetch(vars);
  }

  render() {
    let { tableProps, errors, users } = this.props;

    const TableWithData = this.component;

    return (
      <div>
        {errors &&
          errors.map(
            error =>
              error.field !== 'nodata' && (
                <div className="alert alert-danger" role="alert" key={error.field}>
                  {error.message}
                </div>
              )
          )}

        <TableWithData
          data={users}
          filterable
          manual
          {...tableProps}
          onFetchData={this.onFetchData}
          onFilteredChange={this.onFetchData}
        />
      </div>
    );
  }
}

export default PagingParams;
