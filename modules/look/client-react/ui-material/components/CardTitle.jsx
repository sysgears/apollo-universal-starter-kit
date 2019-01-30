import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const CardTitle = ({ children, ...props }) => (
  <Typography variant="h5" {...props}>
    {children}
  </Typography>
);

CardTitle.propTypes = {
  children: PropTypes.node
};

export default CardTitle;
