import React from 'react';
import ADTable from 'antd/lib/table';

const Table = ({ ...props }) => {
  return (
    <div>
      <ADTable pagination={false} {...props} rowKey="id" />
    </div>
  );
};

export default Table;
