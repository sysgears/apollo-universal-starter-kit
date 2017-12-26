import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Container, Card, CardGroup, CardTitle, CardText } from '../../../common/components/web';

export const UserMembershipsBoth = ({ user }) => {
  return (
    <Card key="profile-memberships">
      <CardGroup>
        <CardTitle>Memberships</CardTitle>

        <br />
        <UserOrgList user={user} />
        <br />
        <UserGroupList user={user} />
      </CardGroup>
    </Card>
  );
};

UserMembershipsBoth.propTypes = {
  user: PropTypes.object.isRequired
};

export const UserOrgList = ({ user }) => {
  return (
    <Container>
      {user.orgs &&
        user.orgs.map(o => {
          let roles = user.orgRoles.filter(elem => elem.orgId == o.id);
          return (
            <CardText key={o.id}>
              <Link to={'/orgs/' + o.id}>{o.profile.displayName}</Link>
              {roles && (
                <span>
                  {' '}
                  [{' '}
                  {roles.map(r => (
                    <span>
                      {' '}
                      <Link to={'/roles/' + r.id}> {r.name} </Link>
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
    </Container>
  );
};

UserOrgList.propTypes = {
  user: PropTypes.object.isRequired
};

export const UserGroupList = ({ user }) => {
  return (
    <Container>
      {user.groups &&
        user.groups.map(o => {
          let roles = user.groupRoles.filter(elem => elem.groupId == o.id);
          return (
            <CardText key={o.id}>
              <Link to={'/groups/' + o.id}>{o.profile.displayName}</Link>
              {roles && (
                <span>
                  {' '}
                  [{' '}
                  {roles.map(r => (
                    <span>
                      {' '}
                      <Link to={'/roles/' + r.id}> {r.name} </Link>
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
    </Container>
  );
};

UserGroupList.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserMembershipsBoth;
