import React from 'react';
import { Button as RSButton } from 'reactstrap';

interface ButtonProps {
  children: any;
}

export default class Button extends React.Component<ButtonProps> {
  public render() {
    const { children, ...props } = this.props;
    return <RSButton {...props}>{children}</RSButton>;
  }
}
