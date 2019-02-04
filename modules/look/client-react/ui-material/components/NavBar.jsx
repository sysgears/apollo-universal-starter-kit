import React from 'react';
import PropTypes from 'prop-types';
import { Route, NavLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import settings from '../../../../../settings';

const ref = { modules: null };

export const onAppCreate = modules => (ref.modules = modules);

const styles = {
  appBar: {
    margin: 0,
    boxShadow: '0 3px 5px 2px rgba(0,0,0,0.14)',
    marginBottom: '20px'
  },
  appBarItemWrapper: {
    margin: 0,
    width: '100%'
  },
  activeLinkBock: {
    borderBottom: '2px solid #3f51b5'
  }
};

const NavBar = ({ classes }) => (
  <Grid className={classes.appBar} container justify="space-between">
    <Grid item>
      <Grid className={classes.appBarItemWrapper} container spacing={24}>
        <Route>
          {({ match }) => {
            return (
              <Grid item className={match.path === '/' ? classes.activeLinkBock : ''}>
                <NavLink to="/">{settings.app.name}</NavLink>
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
