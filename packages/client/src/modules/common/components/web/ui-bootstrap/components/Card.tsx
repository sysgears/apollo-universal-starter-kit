import React from 'react';
import { Card as RSCard } from 'reactstrap';

interface CardProps {
  children: any;
}

const Card = ({ children, ...props }: CardProps) => {
  return <RSCard {...props}>{children}</RSCard>;
};

export default Card;
