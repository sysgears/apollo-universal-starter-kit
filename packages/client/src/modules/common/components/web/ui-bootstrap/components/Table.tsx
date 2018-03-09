import React from 'react';
import { Table as RSTable } from 'reactstrap';

interface Column {
  title: string;
  dataIndex: string;
  renderHeader: any;
  key: string;
  render?: (text: string, record: any) => any;
}

interface TableProps {
  dataSource: any[];
  columns: Column[];
}

const renderHead = (columns: Column[]) => {
  return columns.map(({ title, dataIndex, renderHeader, key }: Column) => {
    return (
      <th key={key} className={`w-${columns.length === 2 ? 100 : 100 / columns.length}`}>
        {renderHeader ? renderHeader(title, dataIndex) : title}
      </th>
    );
  });
};

const renderBody = (columns: Column[], dataSource: any[]) => {
  return dataSource.map(entry => {
    return <tr key={entry.id}>{renderData(columns, entry)}</tr>;
  });
};

const renderData = (columns: Column[], entry: any) => {
  return columns.map(({ dataIndex, render, key }) => {
    return <td key={key}>{render ? render(entry[dataIndex], entry) : entry[dataIndex]}</td>;
  });
};

const Table = ({ dataSource, columns, ...props }: TableProps) => {
  return (
    <RSTable {...props}>
      <thead>
        <tr>{renderHead(columns)}</tr>
      </thead>
      <tbody>{renderBody(columns, dataSource)}</tbody>
    </RSTable>
  );
};

export default Table;
