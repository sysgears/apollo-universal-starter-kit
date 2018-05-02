import React from 'react';
import PropTypes from 'prop-types';
import { Table as RSTable } from 'reactstrap';
import { Button } from '../components';
import TablePagination from './Pagination';

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

const renderPagination = (dataSource, handlePageChange, hasNextPage, pagination, totalCount, loadMoreText, limit) => {
  switch (pagination) {
    case RELAY_PAGINATION: {
      if (hasNextPage) {
        return (
          <div>
            <div>
              <small>
                ({dataSource.length} / {totalCount})
              </small>
            </div>
            <Button id="load-more" color="primary" onClick={() => handlePageChange(pagination, null)}>
              {loadMoreText}
            </Button>
          </div>
        );
      }
      break;
    }
    case STANDARD_PAGINATION: {
      const pagesArray = Array(Math.ceil(totalCount / limit))
        .fill(1)
        .map((x, y) => x + y);
      return (
        <TablePagination pagesArray={pagesArray} handlePageChange={handlePageChange} pagination={STANDARD_PAGINATION} />
      );
    }
  }
};

const Table = ({
  dataSource,
  columns,
  totalCount,
  handlePageChange,
  hasNextPage,
  pagination,
  loadMoreText,
  limit,
  ...props
}) => {
  return (
    <div>
      <RSTable {...props}>
        <thead>
          <tr>{renderHead(columns)}</tr>
        </thead>
        <tbody>{renderBody(columns, dataSource)}</tbody>
      </RSTable>
      {renderPagination(dataSource, handlePageChange, hasNextPage, pagination, totalCount, loadMoreText, limit)}
    </div>
  );
};

Table.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  totalCount: PropTypes.number,
  handlePageChange: PropTypes.func,
  hasNextPage: PropTypes.bool,
  pagination: PropTypes.string,
  loadMoreText: PropTypes.string,
  limit: PropTypes.number
};

export default Table;
export { RELAY_PAGINATION, STANDARD_PAGINATION };
