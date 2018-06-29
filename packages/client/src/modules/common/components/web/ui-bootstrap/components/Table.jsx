import React from 'react';
import PropTypes from 'prop-types';
import { Table as RSTable } from 'reactstrap';

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

const Table = ({
  dataSource,
  columns,
  title,
  footer,
  onHeaderRow,
  rowSelection,
  pagination,
  loading,
  onRow,
  ...props
}) => {
  return (
    <RSTable {...props}>
      <thead>
        {title ? (
          <tr>
            <th colSpan={100}>{title()}</th>
          </tr>
        ) : null}
        <tr>{renderHead(columns)}</tr>
      </thead>
      <tbody>{dataSource && renderBody(columns, dataSource)}</tbody>
    </RSTable>
  );
};

Table.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  pagination: PropTypes.bool,
  loading: PropTypes.bool,
  title: PropTypes.func,
  footer: PropTypes.any,
  onHeaderRow: PropTypes.any,
  rowSelection: PropTypes.any,
  onRow: PropTypes.any
};

export default Table;
