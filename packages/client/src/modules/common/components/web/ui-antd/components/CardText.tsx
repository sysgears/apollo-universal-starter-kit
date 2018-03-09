import React from 'react';

interface CardTextProps {
  children: any;
}

const CardText = ({ children, ...props }: CardTextProps) => {
  return <p {...props}>{children}</p>;
};

export default CardText;
