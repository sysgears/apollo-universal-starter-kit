/*eslint-disable no-unused-vars*/
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import _ from 'lodash';

import { PageLayout } from '../../../common/components/web';
import TabLayout from '../../../common/components/hoc/layouts/sidenav-tab-browser';

import { Admin } from '../../index';

import Dashboard from '../containers/Dashboard';

import settings from '../../../../../../settings';

const renderMetaData = hash => {
  const title = `Admin`;
  const content = `${settings.app.name} - Admin page`;

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

class AdminMainView extends React.Component {
  render() {
    const { location } = this.props;
    const hash = location.hash.substr(1);

    const mainview = {
      name: 'admin',
      component: Dashboard
    };

    let subviews = [];
    for (let i = 0; i < Admin.sideNavItems.length; i++) {
      subviews.push({
        name: Admin.sideNavItems[i],
        component: Admin.viewComponents[i]
      });
    }

    return (
      <PageLayout>
        {renderMetaData(hash)}

        <TabLayout mainview={mainview} subviews={subviews} activeTab={hash} />
      </PageLayout>
    );
  }
}

AdminMainView.propTypes = {
  location: PropTypes.object
};

export default AdminMainView;
