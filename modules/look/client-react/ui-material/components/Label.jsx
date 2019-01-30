import React from 'react';
import PropTypes from 'prop-types';
import FormLabel from '@material-ui/core/FormLabel';

const Label = ({ children, ...props }) => {
  return <FormLabel {...props}>{children}</FormLabel>;
};

Label.propTypes = {
  children: PropTypes.node
};

export default Label;
