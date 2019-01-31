import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

const Col = ({ children, ...props }) => (
  <Grid item {...props}>
    {children}
  </Grid>
);

Col.propTypes = {
  children: PropTypes.node
};

export default Col;
