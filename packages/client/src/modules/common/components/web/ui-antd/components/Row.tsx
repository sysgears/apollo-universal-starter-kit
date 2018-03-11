import React from 'react';
import ADRow from 'antd/lib/row';

interface RowProps {
  children: any;
}

const Row = ({ children, ...props }: RowProps) => {
  return <ADRow {...props}>{children}</ADRow>;
};

export default Row;
