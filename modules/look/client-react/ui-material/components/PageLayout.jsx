import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import NavBar from './NavBar';

import settings from '../../../../../settings';

const styles = {
  root: {
    backgroundColor: 'white'
  },
  main: {
    minHeight: 'calc(100vh - 91px)',
    paddingTop: 20
  },
  mainWithoutNavBar: {
    minHeight: 'calc(100vh - 39px)'
  },
  footer: {
    margin: '10px 0'
  }
};

const PageLayout = ({ children, hideNavBar, classes }) => (
  <React.Fragment>
    <CssBaseline />
    <Grid container className={classes.root} direction="column">
      {!hideNavBar && <NavBar />}
      <Grid item className={!hideNavBar ? classes.main : classes.mainWithoutNavBar} id="content">
        <Grid container justify="center">
          <Grid item xs={11}>
            {children}
          </Grid>
        </Grid>
      </Grid>
      <Grid container className={classes.footer} justify="center">
        {new Date().getFullYear()}. {settings.app.name}.
      </Grid>
    </Grid>
  </React.Fragment>
);

PageLayout.propTypes = {
  children: PropTypes.node,
  hideNavBar: PropTypes.bool,
  classes: PropTypes.object
};

PageLayout.defaultProps = {
  hideNavBar: false
};

export default withStyles(styles)(PageLayout);
