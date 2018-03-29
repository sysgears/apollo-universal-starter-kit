import React from 'react';
import { Container as RSContainer } from 'reactstrap';

interface ContainerProps {
  children: any;
}

const Container = ({ children, ...props }: ContainerProps) => {
  return <RSContainer {...props}>{children}</RSContainer>;
};

export default Container;
