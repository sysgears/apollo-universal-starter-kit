import React from 'react';
import ADTable from 'antd/lib/table';

interface TableProps {
  children: any;
}

const Table = ({ ...props }: TableProps) => {
  return <ADTable pagination={false} {...props} rowKey="id" />;
};

export default Table;
