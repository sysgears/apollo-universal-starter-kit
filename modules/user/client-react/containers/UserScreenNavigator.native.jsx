import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { compose } from '@gqlapp/core-common';

import { withUser } from './Auth';

const Drawer = createDrawerNavigator();

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
};

class UserScreenNavigator extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    context: PropTypes.object,
    currentUserLoading: PropTypes.bool.isRequired,
    routeConfigs: PropTypes.array
  };

  shouldComponentUpdate(nextProps) {
    const { currentUserLoading, currentUser } = this.props;
    /**
     * After a user edits the profile the CurrentUser being updated in the State as well.
     * That leads to the Navigator re-rendering and, as a result, takes the user back to the initial route.
     * In order to let the user get back to his/her profile we need to prevent the Navigator
     * re-render action after profile was edited
     */
    return !(
      !currentUserLoading &&
      currentUser &&
      nextProps.currentUser &&
      currentUser.id === nextProps.currentUser.id &&
      currentUser.role === nextProps.currentUser.role
    );
  }

  navItemsFilter = () => {
    const { currentUser, currentUserLoading, routeConfigs } = this.props;

    const userFilter = value => {
      if (!value.userInfo) return true;
      const { showOnLogin, role } = value.userInfo;
      return showOnLogin && (!role || (Array.isArray(role) ? role : [role]).includes(currentUser.role));
    };

    const guestFilter = value => !value.userInfo || (value.userInfo && !value.userInfo.showOnLogin);

    return routeConfigs.filter(currentUser && !currentUserLoading ? userFilter : guestFilter);
  };

  getInitialRoute = () => {
    const { currentUser } = this.props;
    return currentUser ? 'Profile' : 'Counter';
  };

  render() {
    // const MainScreenNavigatorComponent = createAppContainer(
    //   createDrawerNavigator(
    //     { ...this.navItemsFilter() },
    //     {
    //       // eslint-disable-next-line
    //     contentComponent: props => <DrawerComponent {...props} drawerItems={this.props.routeConfigs} />,
    //       initialRouteName: this.getInitialRoute()
    //     }
    //   )
    // );
    // console.log(require('util').inspect(this.props, false, null));
    return (
      <NavigationContainer>
        <Drawer.Navigator>{this.navItemsFilter().map(x => x.screen)}</Drawer.Navigator>
      </NavigationContainer>
    );
  }
}

const drawerNavigator = routeConfigs => {
  const withRoutes = Component => {
    const ownProps = { routeConfigs };
    const WithRoutesComponent = ({ ...props }) => <Component {...props} {...ownProps} />;
    return WithRoutesComponent;
  };

  return compose(withUser, withRoutes)(UserScreenNavigator);
};

export default drawerNavigator;
