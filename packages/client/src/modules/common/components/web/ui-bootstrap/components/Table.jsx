import React from 'react';
import PropTypes from 'prop-types';
import { Table as RSTable, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Button } from '../components';

const RELAY_PAGINATION = 'relay';
const STANDARD_PAGINATION = 'standard';

const renderHead = columns => {
  return columns.map(({ title, dataIndex, renderHeader, key }) => {
    return (
      <th key={key} className={`w-${columns.length === 2 ? 100 : 100 / columns.length}`}>
        {renderHeader ? renderHeader(title, dataIndex) : title}
      </th>
    );
  });
};

const renderBody = (columns, dataSource) => {
  return dataSource.map(entry => {
    return <tr key={entry.id}>{renderData(columns, entry)}</tr>;
  });
};

const renderData = (columns, entry) => {
  return columns.map(({ dataIndex, render, key }) => {
    return <td key={key}>{render ? render(entry[dataIndex], entry) : entry[dataIndex]}</td>;
  });
};

class PaginationItems extends React.Component {
  static propTypes = {
    loadData: PropTypes.func,
    pagination: PropTypes.string,
    numbers: PropTypes.array
  };

  constructor(props) {
    super(props);
    console.log(props);
    this.state = { active: 1 };
  }

  handleClick = number => {
    this.setState({ active: number });
    this.props.loadData(this.props.pagination, number);
  };

  render() {
    return this.props.numbers.map(number => (
      <PaginationItem
        key={number.toString()}
        onClick={() => this.handleClick(number)}
        active={this.state.active === number}
      >
        <PaginationLink href="#">{number}</PaginationLink>
      </PaginationItem>
    ));
  }
}

const renderLoadMore = (dataSource, loadData, pageInfo, pagination, totalCount) => {
  switch (pagination) {
    case RELAY_PAGINATION: {
      if (pageInfo.hasNextPage) {
        return (
          <div>
            <div>
              <small>
                ({dataSource.length} / {totalCount})
              </small>
            </div>
            <Button id="load-more" color="primary" onClick={() => loadData(pagination)}>
              Load more ...
            </Button>
          </div>
        );
      }
      break;
    }
    case STANDARD_PAGINATION: {
      const pagesCount = Math.ceil(totalCount / 10);
      const pagesArray = Array(pagesCount)
        .fill(1)
        .map((x, y) => x + y);
      return (
        <Pagination className="float-right">
          <PaginationItems numbers={pagesArray} loadData={loadData} pagination={STANDARD_PAGINATION} />
        </Pagination>
      );
    }
  }
};

const Table = ({ dataSource, columns, totalCount, loadData, pageInfo, pagination, ...props }) => {
  return (
    <div>
      <RSTable {...props}>
        <thead>
          <tr>{renderHead(columns)}</tr>
        </thead>
        <tbody>{renderBody(columns, dataSource)}</tbody>
      </RSTable>
      {renderLoadMore(dataSource, loadData, pageInfo, pagination, totalCount)}
    </div>
  );
};

Table.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  totalCount: PropTypes.number,
  loadData: PropTypes.func.isRequired,
  pageInfo: PropTypes.object,
  pagination: PropTypes.string
};

export default Table;
export { RELAY_PAGINATION, STANDARD_PAGINATION };
