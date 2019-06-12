import React from 'react';
import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { pickBy } from 'lodash';
import { compose } from 'react-apollo';
import { DrawerComponent } from '@gqlapp/look-client-react-native';

import { withUser } from './Auth';

const isRerender = (prevProps, nextProps) => {
  const { currentUserLoading, currentUser } = prevProps;
  /**
   * After a user edits the profile the CurrentUser being updated in the State as well.
   * That leads to the Navigator re-rendering and, as a result, takes the user back to the initial route.
   * In order to let the user get back to his/her profile we need to prevent the Navigator
   * re-render action after profile was edited
   */
  return (
    !currentUserLoading &&
    currentUser &&
    nextProps.currentUser &&
    currentUser.id === nextProps.currentUser.id &&
    currentUser.role === nextProps.currentUser.role
  );
};

const UserScreenNavigator = React.memo(({ currentUser, currentUserLoading, routeConfigs }) => {
  const navItemsFilter = () => {
    const userFilter = value => {
      if (!value.userInfo) return true;
      const { showOnLogin, role } = value.userInfo;
      return showOnLogin && (!role || (Array.isArray(role) ? role : [role]).includes(currentUser.role));
    };

    const guestFilter = value => !value.userInfo || (value.userInfo && !value.userInfo.showOnLogin);

    return pickBy(routeConfigs, currentUser && !currentUserLoading ? userFilter : guestFilter);
  };

  const getInitialRoute = () => (currentUser ? 'Profile' : 'Counter');

  const MainScreenNavigatorComponent = createAppContainer(
    createDrawerNavigator(
      { ...navItemsFilter() },
      {
        // eslint-disable-next-line
        contentComponent: data => <DrawerComponent {...data} drawerItems={routeConfigs} />,
        initialRouteName: getInitialRoute()
      }
    )
  );

  return <MainScreenNavigatorComponent />;
}, isRerender);

UserScreenNavigator.propTypes = {
  currentUser: PropTypes.object,
  context: PropTypes.object,
  currentUserLoading: PropTypes.bool.isRequired,
  routeConfigs: PropTypes.object
};

const drawerNavigator = routeConfigs => {
  const withRoutes = Component => {
    const ownProps = { routeConfigs };
    const WithRoutesComponent = ({ ...props }) => <Component {...props} {...ownProps} />;
    return WithRoutesComponent;
  };

  return compose(
    withUser,
    withRoutes
  )(UserScreenNavigator);
};

export default drawerNavigator;
