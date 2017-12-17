import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { Container, Row, Col, PageLayout, Button } from '../../../common/components/web';

import GroupsFilter from '../containers/GroupsFilter';
import GroupsList from '../containers/GroupsList';

import settings from '../../../../../../settings';

const title = `${settings.app.name} - Groups`;
const content = `${settings.app.name} - Groups page`;

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

const GroupsView = () => {
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
              <Link to="/groups/add">
                <Button color="primary">Add</Button>
              </Link>
            </Col>
          </Row>
        </Container>
        <hr />
        <GroupsFilter />
        <GroupsList />
      </div>
    </PageLayout>
  );
};

export default GroupsView;
