import React from 'react';
import { CardBody } from 'reactstrap';

interface CardGroupProps {
  children: any;
}

const CardGroup = ({ children, ...props }: CardGroupProps) => {
  return <CardBody {...props}>{children}</CardBody>;
};

export default CardGroup;
