import { TabNavigator } from 'react-navigation';
import React from 'react';
import PropTypes from 'prop-types';
import { pickBy } from 'lodash';
import modules from '../modules';
import { withUser } from '../modules/user/common/containers/AuthBase';

function navTabsFilter(currentUser, currentUserLoading) {
  if (currentUser && !currentUserLoading) {
    return pickBy(modules.tabItems, value => {
      return (
        (value.userInfo && value.userInfo.requiredLogin && value.userInfo.role === currentUser.role) ||
        (value.userInfo && value.userInfo.requiredLogin && !value.userInfo.role) ||
        !value.userInfo
      );
    });
  }
  return pickBy(modules.tabItems, value => {
    return !value.userInfo || (value.userInfo && !value.userInfo.requiredLogin);
  });
}

class MainScreenNavigator extends React.Component {
  render() {
    const { currentUser, currentUserLoading } = this.props;
    const MainScreenNavigator = TabNavigator({
      ...navTabsFilter(currentUser, currentUserLoading)
    });

    return <MainScreenNavigator />;
  }
}

MainScreenNavigator.propTypes = {
  currentUser: PropTypes.object,
  currentUserLoading: PropTypes.bool.isRequired
};

export default withUser(MainScreenNavigator);
