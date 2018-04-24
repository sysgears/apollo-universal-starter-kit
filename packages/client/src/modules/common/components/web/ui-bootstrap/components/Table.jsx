import React from 'react';
import PropTypes from 'prop-types';
import { Table as RSTable } from 'reactstrap';
import { Button } from '../components';

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

const renderLoadMore = (dataSource, loadMoreRows, pageInfo) => {
  if (pageInfo.hasNextPage) {
    return (
      <Button id="load-more" color="primary" onClick={loadMoreRows}>
        Load more ...
      </Button>
    );
  }
};

const Table = ({ dataSource, columns, totalCount, loadMoreRows, pageInfo, ...props }) => {
  console.log(props);
  return (
    <div>
      <RSTable {...props}>
        <thead>
          <tr>{renderHead(columns)}</tr>
        </thead>
        <tbody>{renderBody(columns, dataSource)}</tbody>
      </RSTable>
      <div>
        <small>
          ({dataSource.length} / {totalCount})
        </small>
      </div>
      {renderLoadMore(dataSource, loadMoreRows, pageInfo)}
    </div>
  );
};

Table.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  totalCount: PropTypes.number,
  loadMoreRows: PropTypes.func.isRequired,
  pageInfo: PropTypes.object,
  pagination: PropTypes.bool
};

export default Table;
