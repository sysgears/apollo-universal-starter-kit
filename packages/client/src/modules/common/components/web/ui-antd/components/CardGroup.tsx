import React from 'react';

interface CardGroupProps {
  children: any;
}

const CardGroup = ({ children, ...props }: CardGroupProps) => {
  return <div {...props}>{children}</div>;
};

export default CardGroup;
