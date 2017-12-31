/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { PageLayout } from '../../../common/components/web';
import TabLayout from '../../../common/components/hoc/layouts/sidenav-tab-browser';

import GroupInfo from './GroupInfoView';
import GroupMembers from '../containers/GroupMembers';
import GroupSettings from '../containers/GroupSettings';

import settings from '../../../../../../settings';

const renderMetaData = group => {
  let title = `Group`;
  let content = `${settings.app.name} - Group page`;
  if (group) {
    content = `${group.name} - Group page`;
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

class GroupMainView extends React.Component {
  render() {
    let { loading, group, location } = this.props;

    if (loading && !group) {
      return (
        <PageLayout>
          {renderMetaData(null)}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else if (group) {
      const { location } = this.props;
      const hash = location.hash.substr(1);

      const mainview = {
        name: 'group',
        baseUrl: '/groups/' + group.id,
        component: GroupInfo
      };

      let subviews = [
        {
          name: 'members',
          component: GroupMembers
        },
        {
          name: 'settings',
          component: GroupSettings
        }
      ];

      return (
        <PageLayout>
          {renderMetaData(group)}

          <TabLayout group={group} mainview={mainview} subviews={subviews} activeTab={hash} />
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {renderMetaData(null)}
          <h2>No group</h2>
        </PageLayout>
      );
    }
  }
}

GroupMainView.propTypes = {
  loading: PropTypes.bool.isRequired,
  location: PropTypes.object
};

export default GroupMainView;
