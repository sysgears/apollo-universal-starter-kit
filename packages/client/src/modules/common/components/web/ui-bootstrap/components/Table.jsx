import React from 'react';
import PropTypes from 'prop-types';
import { Table as RSTable } from 'reactstrap';
import { Button } from '../components';
import TablePagination from './Pagination';
import paginationConfig from '../../../../../../../../../config/pagination';

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
    case paginationConfig.paginationTypes.relay: {
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
    case paginationConfig.paginationTypes.standard: {
      const pagesArray = Array(Math.ceil(totalCount / limit))
        .fill(1)
        .map((x, y) => x + y);
      return <TablePagination pagesArray={pagesArray} handlePageChange={handlePageChange} pagination={pagination} />;
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
