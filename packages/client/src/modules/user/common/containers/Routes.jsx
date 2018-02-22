import { TabNavigator } from 'react-navigation';
import React from 'react';
import PropTypes from 'prop-types';
import { pickBy } from 'lodash';
import { withUser, withCheckAction } from './AuthBase';

class MainScreenNavigator extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    currentUserLoading: PropTypes.bool.isRequired,
    routeConfigs: PropTypes.object,
    action: PropTypes.string
  };

  navTabsFilter = () => {
    const { currentUser, currentUserLoading, routeConfigs } = this.props;

    const userFilter = value => {
      if (!value.userInfo) return true;
      const { showOnLogin, role } = value.userInfo;
      return showOnLogin && (!role || role === currentUser.role);
    };

    const guestFilter = value => !value.userInfo || (value.userInfo && !value.userInfo.showOnLogin);

    return pickBy(routeConfigs, currentUser && !currentUserLoading ? userFilter : guestFilter);
  };

  getInitialRoute = () => {
    const { currentUser, action } = this.props;
    return action === 'Login' && currentUser ? 'Profile' : 'Counter';
  };

  render() {
    const MainScreenNavigatorComponent = TabNavigator(
      { ...this.navTabsFilter() },
      { initialRouteName: this.getInitialRoute() }
    );

    return <MainScreenNavigatorComponent />;
  }
}

const tabNavigator = routeConfigs => {
  const withRoutes = Component => {
    const ownProps = { routeConfigs };
    const WithRoutesComponent = ({ ...props }) => <Component {...props} {...ownProps} />;
    return WithRoutesComponent;
  };

  return withCheckAction(withRoutes(withUser(MainScreenNavigator)));
};

export default tabNavigator;
