import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  activeLinkBock: {
    borderBottom: '2px solid #3f51b5'
  }
};

const MenuItem = ({ classes, children, ...props }) => (
  <Route>
    {({ match }) => {
      return (
        <Grid item className={match.path === props.to ? classes.activeLinkBock : ''}>
          <Typography variant="button">{children}</Typography>
        </Grid>
      );
    }}
  </Route>
);

MenuItem.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object,
  to: PropTypes.string
};

export default withStyles(styles)(MenuItem);
