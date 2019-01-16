import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { withStyles } from '@material-ui/core/styles';

import settings from '../../../../../settings';

const ref = { modules: null };

export const onAppCreate = modules => (ref.modules = modules);

const styles = {
  appBar: {
    position: 'relative'
  }
};

class NavBar extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { classes } = this.props;

    return (
      <AppBar className={classes.appBar} color="default" position="static">
        <BottomNavigation value={value} onChange={this.handleChange} showLabels>
          <BottomNavigationAction
            label={
              <NavLink to="/" className="nav-link">
                {settings.app.name}
              </NavLink>
            }
          />

          {ref.modules.navItems}

          {ref.modules.navItemsRight}

          {__DEV__ && (
            <BottomNavigationAction
              label={
                <a href="/graphiql" className="nav-link">
                  GraphiQL
                </a>
              }
            />
          )}
        </BottomNavigation>
      </AppBar>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavBar);
