import React from 'react';
import PropTypes from 'prop-types';
// import Button from '@material-ui/core/Button';
import MUIButton from '@material-ui/core/Button';

const Button = ({ children, ...props }) => {
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
