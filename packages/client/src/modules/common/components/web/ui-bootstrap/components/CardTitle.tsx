import React from 'react';
import { CardTitle as RSCardTitle } from 'reactstrap';

interface CardTitleProps {
  children: any;
}

const CardTitle = ({ children, ...props }: CardTitleProps) => {
  return <RSCardTitle {...props}>{children}</RSCardTitle>;
};

export default CardTitle;
