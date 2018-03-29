import React from 'react';

interface CardTitleProps {
  children: any;
}

const CardTitle = ({ children, ...props }: CardTitleProps) => {
  return <h1 {...props}>{children}</h1>;
};

export default CardTitle;
