import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="Orgs"
    meta={[
      {
        name: 'description',
        content: 'Orgs page'
      }
    ]}
  />
);

const OrgsView = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <h2>Orgs</h2>
      </div>
    </PageLayout>
  );
};

export default OrgsView;
