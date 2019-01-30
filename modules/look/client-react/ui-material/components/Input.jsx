import React from 'react';
import PropTypes from 'prop-types';
import MUIInput from '@material-ui/core/Input';

const Input = ({ children, ...props }) => (
  <MUIInput inputProps={props} {...props}>
    {children}
  </MUIInput>
);

Input.propTypes = {
  children: PropTypes.node
};

export default Input;
