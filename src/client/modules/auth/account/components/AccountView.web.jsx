/*eslint-disable no-unused-vars*/
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import changeCase from 'change-case';

import { PageLayout, Container, Row, Col, ListGroup, ListItem, Card, CardTitle } from '../../../common/components/web';

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

const hashes = ['profile', 'security', 'billing', 'subscriptions', 'organizations', 'groups'];

class AccountView extends React.Component {
  renderMenu(active) {
    return (
      <ListGroup>
        <ListItem active action tag="a" account="/account" style={{ color: 'white' }}>
          Account
        </ListItem>
        {hashes.map(H => {
          if (H === active) {
            return <ListItem style={{ color: '#0B0' }}>{changeCase.titleCase(H)}</ListItem>;
          } else {
            return (
              <ListItem action tag="a" href={'/account#' + H} style={{ color: '#007bff' }}>
                {changeCase.titleCase(H)}
              </ListItem>
            );
          }
        })}
      </ListGroup>
    );
  }

  renderContent(active) {
    let { currentUser } = this.props;
    console.log('currentUser', currentUser);

    return (
      <div>
        <h4>{changeCase.titleCase(active) || 'Account'}</h4>
        <hr />
        {active === 'profile' && (
          <div>
            <UserInfo user={currentUser} />
            <br />
            <UserPersonal user={currentUser} />
          </div>
        )}

        {active === 'groups' && (
          <div>
            <UserGroupList user={currentUser} />
          </div>
        )}

        {active === 'organizations' && (
          <div>
            <UserOrgList user={currentUser} />
          </div>
        )}
      </div>
    );
  }

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
      let hash = location.hash.substr(1);

      return (
        <PageLayout>
          {renderMetaData(currentUser)}
          <Container>
            <Row>
              <Col xs={12} md={3} style={{ marginBottom: '2rem;' }}>
                {this.renderMenu(hash)}
              </Col>
              <Col xs={12} md={9}>
                {this.renderContent(hash)}
              </Col>
            </Row>
          </Container>
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
