import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

import NavBar from './NavBar';
// import NavBar from '../../ui-antd/components/NavBar';
// import NavBar from '../../ui-bootstrap/components/NavBar';

import settings from '../../../../../settings';

const styles = {
  root: {
    height: '100%',
    backgroundColor: 'white'
  },
  main: {
    height: 'calc(100vh - 105px)',
    overflowY: 'auto'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: '20px'
  }
};

class PageLayout extends React.Component {
  render() {
    const { children, navBar, classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Grid container className={classes.root} direction="column">
          <Grid container>{navBar !== false && <NavBar />}</Grid>
          <Grid container className={classes.main} wrap="nowrap" direction="column" id="content">
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
