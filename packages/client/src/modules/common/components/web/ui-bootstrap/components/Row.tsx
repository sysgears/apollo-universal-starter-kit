import React from 'react';
import { Row as RSRow } from 'reactstrap';

interface RowProps {
  children: any;
}

const Row = ({ children, ...props }: RowProps) => {
  return <RSRow {...props}>{children}</RSRow>;
};

export default Row;
