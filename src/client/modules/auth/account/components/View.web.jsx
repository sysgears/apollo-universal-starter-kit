/*eslint-disable no-unused-vars*/
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { LayoutCenter } from '../../../common/components';
import { Container, Row, Col, Card, CardGroup, CardTitle, CardText, PageLayout } from '../../../common/components/web';

import SubscriptionProfile from '../../../subscription/containers/SubscriptionProfile';

import UserInfo from './InfoView';
import UserPersonal from './PersonalView';
import UserMemberships from './MembershipsView';

import settings from '../../../../../../settings';

const renderMetaData = currentUser => {
  let title = `${settings.app.name} - Profile`;
  let content = `${settings.app.name} - Profile page`;
  if (currentUser) {
    title = `${currentUser.profile.displayName} - Profile`;
    content = `${currentUser.profile.displayName} - Profile page`;
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

const ProfileView = ({ loading, currentUser }) => {
  if (loading && !currentUser) {
    return (
      <PageLayout>
        {renderMetaData(null)}
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  } else if (currentUser) {
    console.log('currentUser', currentUser);
    const P = currentUser.profile;
    return (
      <PageLayout>
        {renderMetaData(currentUser)}
        <Container>
          <Row>
            <Col xs={12}>
              <h1 className="text-center">{P.displayName} - Profile</h1>

              <UserInfo user={currentUser} />
              <UserPersonal user={currentUser} />
              <UserMemberships user={currentUser} />
            </Col>
          </Row>
        </Container>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <h2>No current user logged in</h2>
      </PageLayout>
    );
  }
};

ProfileView.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object
};

export default ProfileView;
