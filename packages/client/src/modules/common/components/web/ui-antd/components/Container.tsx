import React from 'react';

interface ContainerProps {
  children: any;
}

const Container = ({ children, ...props }: ContainerProps) => {
  return <div {...props}>{children}</div>;
};

export default Container;
