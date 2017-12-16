import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

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
