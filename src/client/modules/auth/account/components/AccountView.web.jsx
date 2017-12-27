/*eslint-disable no-unused-vars*/
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { PageLayout } from '../../../common/components/web';
import TabLayout from '../../../common/components/hoc/layouts/sidenav-tab-browser';

import SubscriptionProfile from '../../../subscription/containers/SubscriptionProfile';

import UserInfo from './InfoView';
import UserPersonal from './PersonalView';
import { UserGroupList, UserOrgList } from './MembershipsView';

import settings from '../../../../../../settings';

const renderMetaData = currentUser => {
  let title = `Account`;
  let content = `${settings.app.name} - Account page`;
  if (currentUser) {
    content = `${currentUser.email} - Account page`;
  }

  return (
    <Helmet
      title={title}
      meta={[
        {
          name: 'description',
          content
        }
      ]}
    />
  );
};

class AccountView extends React.Component {
  render() {
    let { loading, currentUser, location } = this.props;

    if (loading && !currentUser) {
      return (
        <PageLayout>
          {renderMetaData(null)}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else if (currentUser) {
      const { location } = this.props;
      const hash = location.hash.substr(1);

      const mainview = {
        name: 'account',
        component: UserInfo
      };

      let subviews = [
        {
          name: 'profile',
          component: UserPersonal
        },
        {
          name: 'organizations',
          component: UserOrgList
        },
        {
          name: 'groups',
          component: UserGroupList
        }
      ];

      return (
        <PageLayout>
          {renderMetaData(hash)}

          <TabLayout user={currentUser} mainview={mainview} subviews={subviews} activeTab={hash} />
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {renderMetaData()}
          <h2>No current user</h2>
        </PageLayout>
      );
    }
  }
}

AccountView.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  location: PropTypes.object
};

export default AccountView;
