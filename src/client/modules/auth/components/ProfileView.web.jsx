import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { LayoutCenter } from '../../common/components';
import { Card, CardGroup, CardTitle, CardText, PageLayout } from '../../common/components/web';
import SubscriptionProfile from '../../subscription/containers/SubscriptionProfile';

import settings from '../../../../../settings';

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
    // console.log('currentUser', currentUser);
    return (
      <PageLayout>
        {renderMetaData(currentUser)}
        <LayoutCenter>
          <h1 className="text-center">Profile</h1>
          <Card>
            <CardGroup>
              <CardText key="userId">User ID: {currentUser.id}</CardText>
              <CardText key="displayName">Display Name: {currentUser.profile.displayName}</CardText>
            </CardGroup>
            <CardGroup>
              <CardText>Email: {currentUser.email}</CardText>
            </CardGroup>
            <CardGroup>
              <CardTitle>Roles:</CardTitle>
              <CardText key="orgRoles">
                <b>org:</b>
                {/*JSON.stringify(currentUser.orgRoles)*/}
              </CardText>
              <CardText key="groupRoles">
                <b>group:</b>
                {/*JSON.stringify(currentUser.groupRoles)*/}
              </CardText>
              <CardText key="userRoles">
                <b>user:</b>
                {/*JSON.stringify(currentUser.userRoles)*/}
              </CardText>
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
          {settings.entities.groups.enabled && (
            <Card>
              <CardGroup>
                <CardTitle>Groups:</CardTitle>
                {currentUser.groups &&
                  currentUser.groups.map(g => (
                    <CardText key={g.id}>
                      <Link to={'/groups/' + g.id}>{g.profile.displayName}</Link> - {g.profile.description}
                    </CardText>
                  ))}
              </CardGroup>
            </Card>
          )}
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
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object
};

export default ProfileView;
