import React from 'react';
import PropTypes from 'prop-types';
import { Table as RSTable } from 'reactstrap';

const renderHead = columns => {
  return columns.map(({ title, dataIndex, renderHeader, key }) => {
    if (renderHeader) {
      return <td key={key}>{renderHeader(title, dataIndex)}</td>;
    } else {
      return <th key={key}>{title}</th>;
    }
  });
};

const renderBody = (columns, dataSource) => {
  return dataSource.map(entry => {
    return <tr key={entry.id}>{renderData(columns, entry)}</tr>;
  });
};

const renderData = (columns, entry) => {
  return columns.map(({ dataIndex, render, key }) => {
    if (render) {
      return <td key={key}>{render(entry[dataIndex], entry)}</td>;
    } else {
      return <td key={key}>{entry[dataIndex]}</td>;
    }
  });
};

const Table = ({ dataSource, columns, ...props }) => {
  return (
    <RSTable {...props}>
      <thead>
        <tr>{renderHead(columns)}</tr>
      </thead>
      <tbody>{renderBody(columns, dataSource)}</tbody>
    </RSTable>
  );
};

Table.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array
};

export default Table;
