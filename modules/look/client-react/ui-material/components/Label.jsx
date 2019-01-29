import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const Label = ({ children, ...props }) => {
  return (
    <Typography component="label" {...props}>
      {children}
    </Typography>
  );
};

Label.propTypes = {
  children: PropTypes.node
};

export default Label;
