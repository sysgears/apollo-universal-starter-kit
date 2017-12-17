/*eslint-disable no-unused-vars*/
import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { Container, Row, Col, PageLayout, Button } from '../../common/components/web';

import settings from '../../../../../settings';

const config = settings.entities;

const renderMetaData = () => (
  <Helmet
    title="Entities"
    meta={[
      {
        name: 'description',
        content: 'Entities page'
      }
    ]}
  />
);

const EntitiesView = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>Hello Entities!</p>
      </div>
    </PageLayout>
  );
};

export default EntitiesView;
