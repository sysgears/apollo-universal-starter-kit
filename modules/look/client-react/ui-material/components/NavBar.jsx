import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import settings from '../../../../../settings';

const ref = { modules: null };

export const onAppCreate = modules => (ref.modules = modules);

const styles = {
  appBar: {
    margin: 0,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
  },
  appBarItemWrapper: {
    margin: 0
  }
};

const NavBar = ({ classes }) => (
  <Grid className={classes.appBar} container justify="space-between">
    <Grid item>
      <Grid className={classes.appBarItemWrapper} container spacing={24}>
        <Grid item>
          <NavLink to="/" activeClassName="active">
            {settings.app.name}
          </NavLink>
        </Grid>
        {ref.modules.navItems}
      </Grid>
    </Grid>

    <Grid item>
      <Grid className={classes.appBarItemWrapper} container spacing={24}>
        {ref.modules.navItemsRight}

        {__DEV__ && (
          <Grid item>
            <a href="/graphiql">GraphiQL</a>
          </Grid>
        )}
      </Grid>
    </Grid>
  </Grid>
);

NavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavBar);
