import React from 'react';
import PropTypes from 'prop-types';
import { Route, NavLink } from 'react-router-dom';
import { Grid, AppBar, Typography } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import settings from '../../../../../settings';

const ref = { modules: null };

export const onAppCreate = modules => (ref.modules = modules);

const styles = {
  appBarItemWrapper: {
    margin: 0,
    width: '100%'
  },
  activeLinkBlock: {
    borderBottom: '2px solid #3f51b5'
  }
};

const NavBar = ({ classes }) => (
  <AppBar position="static" color="default">
    <Grid container justify="space-between">
      <Grid item>
        <Grid className={classes.appBarItemWrapper} container spacing={24}>
          <Route>
            {({ match }) => {
              return (
                <Grid item className={match.path === '/' ? classes.activeLinkBlock : ''}>
                  <Typography variant="button">
                    <NavLink to="/">{settings.app.name}</NavLink>
                  </Typography>
                </Grid>
              );
            }}
          </Route>
          {ref.modules.navItems}
        </Grid>
      </Grid>
      <Grid item>
        <Grid className={classes.appBarItemWrapper} container spacing={24}>
          {ref.modules.navItemsRight}

          {__DEV__ && (
            <Grid item>
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
