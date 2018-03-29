import React from 'react';
import { CardText as RSCardText } from 'reactstrap';

interface CardTextProps {
  children: any;
}

const CardText = ({ children, ...props }: CardTextProps) => {
  return <RSCardText {...props}>{children}</RSCardText>;
};

export default CardText;
