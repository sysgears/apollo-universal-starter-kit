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
    minHeight: 'calc(100vh - 83px)'
  },
  footer: {
    margin: '10px 0'
  }
};

class PageLayout extends React.Component {
  render() {
    const { children, navBar, classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Grid container className={classes.root} direction="column">
          {navBar !== false && <NavBar />}
          <Grid className={classes.main} id="content">
            {children}
          </Grid>
          <Grid container className={classes.footer} justify="center">
            {new Date().getFullYear()}. {settings.app.name}.
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

PageLayout.propTypes = {
  children: PropTypes.node,
  navBar: PropTypes.bool,
  classes: PropTypes.object
};

export default withStyles(styles)(PageLayout);
