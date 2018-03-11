import React from 'react';

interface ListGroupProps {
  children: any;
}

const ListGroup = ({ children, ...props }: ListGroupProps) => {
  return <ul {...props}>{children}</ul>;
};

export default ListGroup;
