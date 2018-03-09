import React from 'react';
import ADCard from 'antd/lib/card';

interface CardProps {
  children: any;
}

const Card = ({ children, ...props }: CardProps) => {
  return <ADCard {...props}>{children}</ADCard>;
};

export default Card;
