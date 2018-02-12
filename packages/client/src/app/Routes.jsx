import { TabNavigator } from 'react-navigation';
import React from 'react';
import PropTypes from 'prop-types';
import { pickBy } from 'lodash';
import modules from '../modules';
import { withUser } from '../modules/user/common/containers/AuthBase';

function navTabsFilter(currentUser, currentUserLoading) {
  // TODO: simplify this by removing 'requiredLogin' param
  const userFilter = value =>
    (value.userInfo && value.userInfo.requiredLogin && value.userInfo.role === currentUser.role) ||
    (value.userInfo && value.userInfo.requiredLogin && !value.userInfo.role) ||
    !value.userInfo;

  const guestFilter = value => !value.userInfo || (value.userInfo && !value.userInfo.requiredLogin);

  return pickBy(modules.tabItems, currentUser && !currentUserLoading ? userFilter : guestFilter);
}

class MainScreenNavigator extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    currentUserLoading: PropTypes.bool.isRequired
  };

  render() {
    const { currentUser, currentUserLoading } = this.props;
    const MainScreenNavigatorComponent = TabNavigator({
      ...navTabsFilter(currentUser, currentUserLoading)
    });

    return <MainScreenNavigatorComponent />;
  }
}

export default withUser(MainScreenNavigator);
