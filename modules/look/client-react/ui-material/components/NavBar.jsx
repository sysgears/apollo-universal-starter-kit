import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, AppBar, Typography } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import settings from '../../../../../settings';

const ref = { modules: null };

export const onAppCreate = modules => (ref.modules = modules);

const styles = {
  appBarItemWrapper: {
    margin: 0,
    width: '100%'
  }
};

const NavBar = ({ classes }) => (
  <AppBar position="static">
    <Grid container justify="space-between">
      <Grid item>
        <Grid className={classes.appBarItemWrapper} container spacing={24}>
          <Grid item className="nav-link">
            <Typography variant="button">
              <Link to="/">{settings.app.name}</Link>
            </Typography>
          </Grid>
          {ref.modules.navItems}
        </Grid>
      </Grid>
      <Grid item>
        <Grid className={classes.appBarItemWrapper} container spacing={24}>
          {ref.modules.navItemsRight}

          {__DEV__ && (
            <Grid item className="nav-link">
              <Typography variant="button">
                <a href="/graphiql">GraphiQL</a>
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  </AppBar>
);

NavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavBar);
