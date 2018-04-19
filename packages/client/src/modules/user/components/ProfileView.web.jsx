import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { LayoutCenter } from '../../common/components';
import { Card, CardGroup, CardTitle, CardText, PageLayout } from '../../common/components/web';
import SubscriptionProfile from '../../subscription/containers/SubscriptionProfile';

import settings from '../../../../../../settings';

const renderMetaData = () => (
  <Helmet
    title={`${settings.app.name} - Profile`}
    meta={[
      {
        name: 'description',
        content: `${settings.app.name} - Profile page`
      }
    ]}
  />
);

const ProfileView = ({ currentUserLoading, currentUser }) => {
  if (currentUserLoading && !currentUser) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  } else if (currentUser) {
    return (
      <PageLayout>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">Profile</h1>
          <Card>
            <CardGroup>
              <CardTitle>User Name:</CardTitle>
              <CardText>{currentUser.username}</CardText>
            </CardGroup>
            <CardGroup>
              <CardTitle>Email:</CardTitle>
              <CardText>{currentUser.email}</CardText>
            </CardGroup>
            <CardGroup>
              <CardTitle>Role:</CardTitle>
              <CardText>{currentUser.role}</CardText>
            </CardGroup>
            {currentUser.profile &&
              currentUser.profile.fullName && (
                <CardGroup>
                  <CardTitle>Full Name:</CardTitle>
                  <CardText>{currentUser.profile.fullName}</CardText>
                </CardGroup>
              )}
            {settings.subscription.enabled && <SubscriptionProfile />}
          </Card>
          <Link className="mt-2 btn user-link" to={`/users/${currentUser.id}`}>
            Edit Profile
          </Link>
        </LayoutCenter>
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
  currentUserLoading: PropTypes.bool,
  currentUser: PropTypes.object
};

export default ProfileView;
