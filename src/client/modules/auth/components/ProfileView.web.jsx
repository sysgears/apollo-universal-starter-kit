/*eslint-disable no-unused-vars*/
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
    console.log('currentUser', currentUser);
    const P = currentUser.profile;
    return (
      <PageLayout>
        {renderMetaData(currentUser)}
        <LayoutCenter>
          <h1 className="text-center">{P.displayName} - Profile</h1>
          <Card key="user">
            <CardGroup>
              <CardTitle>Info:</CardTitle>
              <CardText key="userId">User ID: {currentUser.id}</CardText>
              <CardText>Email: {currentUser.email}</CardText>
              <CardText>
                User Roles:{' '}
                {currentUser.userRoles && (
                  <span>
                    {' '}
                    [{' '}
                    {currentUser.userRoles.map(r => {
                      return (
                        <Link to={'/roles/' + r.id}>
                          {r.name}
                          {r.id != currentUser.userRoles[0].id ? ',' : ''}{' '}
                        </Link>
                      );
                    })}{' '}
                    ]{' '}
                  </span>
                )}
              </CardText>
            </CardGroup>
            <CardGroup>
              <CardTitle>Profile:</CardTitle>
              <CardText key="displayName">Display Name: {P.displayName}</CardText>
              <CardText key="fullName">
                Full Name: {P.title} {P.firstName} {P.middleName} {P.lastName} {P.suffix}
              </CardText>
              <CardText key="locale">
                Locale: {P.locale} {P.language}
              </CardText>
            </CardGroup>
          </Card>

          {settings.entities.orgs.enabled && (
            <Card key="orgs">
              <CardGroup>
                <CardTitle>Orgs:</CardTitle>
                {currentUser.orgs &&
                  currentUser.orgs.map(o => {
                    let roles = currentUser.orgRoles.filter(elem => elem.orgId == o.id);
                    return (
                      <CardText key={o.id}>
                        <Link to={'/orgs/' + o.id}>{o.profile.displayName}</Link>
                        {roles && (
                          <span>
                            {' '}
                            [{' '}
                            {roles.map(r => (
                              <span>
                                <Link to={'/roles/' + r.id}>{r.name}</Link>
                                {r.id != roles[0].id ? ',' : ''}
                              </span>
                            ))}{' '}
                            ]{' '}
                          </span>
                        )}
                        - {o.profile.description}
                      </CardText>
                    );
                  })}
              </CardGroup>
            </Card>
          )}

          {settings.entities.groups.enabled && (
            <Card key="groups">
              <CardGroup>
                <CardTitle>Groups:</CardTitle>
                {currentUser.groups &&
                  currentUser.groups.map(o => {
                    let roles = currentUser.groupRoles.filter(elem => elem.groupId == o.id);
                    return (
                      <CardText key={o.id}>
                        <Link to={'/groups/' + o.id}>{o.profile.displayName}</Link>
                        {roles && (
                          <span>
                            {' '}
                            [{' '}
                            {roles.map(r => (
                              <span>
                                <Link to={'/roles/' + r.id}>{r.name}</Link>
                                {r.id != roles[0].id ? ',' : ''}
                              </span>
                            ))}{' '}
                            ]{' '}
                          </span>
                        )}
                        - {o.profile.description}
                      </CardText>
                    );
                  })}
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
