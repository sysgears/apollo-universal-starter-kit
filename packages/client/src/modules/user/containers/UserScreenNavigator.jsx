import { createDrawerNavigator } from 'react-navigation';
import React from 'react';
import PropTypes from 'prop-types';
import { pickBy } from 'lodash';
import { withUser } from './Auth';
import { DrawerComponent } from '../../common/components/native';

class UserScreenNavigator extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    currentUserLoading: PropTypes.bool.isRequired,
    routeConfigs: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    /**
     * After a user edits the profile the CurrentUser being updated in the State as well.
     * That leads to the Navigator re-rendering and, as a result, takes the user back to the initial route.
     * In order to let the user get back to his/her profile we need to prevent the Navigator
     * re-render action after profile was edited
     */
    const { currentUserLoading, currentUser } = this.props;
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

    return pickBy(routeConfigs, currentUser && !currentUserLoading ? userFilter : guestFilter);
  };

  getInitialRoute = () => {
    const { currentUser } = this.props;
    return currentUser ? 'Profile' : 'Counter';
  };

  render() {
    const MainScreenNavigatorComponent = createDrawerNavigator(
      { ...this.navItemsFilter() },
      {
        contentComponent: DrawerComponent,
        initialRouteName: this.getInitialRoute()
      }
    );

    return <MainScreenNavigatorComponent />;
  }
}

const drawerNavigator = routeConfigs => {
  const withRoutes = Component => {
    const ownProps = { routeConfigs };
    const WithRoutesComponent = ({ ...props }) => <Component {...props} {...ownProps} />;
    return WithRoutesComponent;
  };

  return withRoutes(withUser(UserScreenNavigator));
};

export default drawerNavigator;
