import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

const Row = ({ children, ...props }) => (
  <Grid container {...props}>
    {children}
  </Grid>
);

Row.propTypes = {
  children: PropTypes.node
};

export default Row;
