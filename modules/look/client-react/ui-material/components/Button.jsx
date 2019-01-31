import React from 'react';
import PropTypes from 'prop-types';
import MUIButton from '@material-ui/core/Button';

const Button = ({ children, size, ...props }) => (
  <MUIButton variant="contained" color="primary" {...props}>
    {children}
  </MUIButton>
);

Button.propTypes = {
  children: PropTypes.node,
  size: PropTypes.string
};

export default Button;
