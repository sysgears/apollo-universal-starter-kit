import React from 'react';
import PropTypes from 'prop-types';
import MUIButton from '@material-ui/core/Button';

const Button = ({ children, size, ...props }) => {
  return (
    <MUIButton variant="contained" color="primary" {...props}>
      {children}
    </MUIButton>
  );
};

Button.propTypes = {
  children: PropTypes.node
};

export default Button;
