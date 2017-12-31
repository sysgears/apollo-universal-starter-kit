/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { Container, Row, Col, PageLayout, Button } from '../../../common/components/web';

import UsersFilter from '../containers/UsersFilter';
import UsersList from '../containers/UsersList';

import settings from '../../../../../../settings';

const title = `${settings.app.name} - Users`;
const content = `${settings.app.name} - Users page`;

const renderMetaData = () => (
  <Helmet
    title={title}
    meta={[
      {
        name: 'description',
        content: content
      }
    ]}
  />
);

const UsersView = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <Container>
          <Row>
            <Col xs={2} />
            <Col xs={8}>
              <h2>{title}</h2>
            </Col>
            <Col xs={2}>
              <Link to="/users/add">
                <Button color="primary">Add</Button>
              </Link>
            </Col>
          </Row>
        </Container>
        <hr />
        <UsersFilter />
        <UsersList />
      </div>
    </PageLayout>
  );
};

export default UsersView;
