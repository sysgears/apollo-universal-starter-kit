import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';

const MenuItem = ({ children, ...props }) => (
  <Grid item className="nav-link">
    <Typography variant="button" {...props}>
      {children}
    </Typography>
  </Grid>
);

MenuItem.propTypes = {
  children: PropTypes.node
};

export default MenuItem;
