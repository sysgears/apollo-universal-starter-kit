import React from 'react';
import { ListGroup as RSListGroup } from 'reactstrap';

interface ListGroupProps {
  children: any;
}

const ListGroup = ({ children, ...props }: ListGroupProps) => {
  return <RSListGroup {...props}>{children}</RSListGroup>;
};

export default ListGroup;
