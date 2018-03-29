import React from 'react';
import { Col as RSCol } from 'reactstrap';

interface ColProps {
  children: any;
}

const Col = ({ children, ...props }: ColProps) => {
  return <RSCol {...props}>{children}</RSCol>;
};

export default Col;
