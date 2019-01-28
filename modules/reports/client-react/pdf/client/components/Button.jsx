import React from 'react';
import PropTypes from 'prop-types';
import { Button as RSButton } from 'reactstrap';

export default class Button extends React.Component {
  render() {
    const { children, ...props } = this.props;
    return <RSButton {...props}>{children}</RSButton>;
  }
}

Button.propTypes = {
  children: PropTypes.node
};
