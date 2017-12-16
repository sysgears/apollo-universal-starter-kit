import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="ServiceAccounts"
    meta={[
      {
        name: 'description',
        content: 'ServiceAccounts page'
      }
    ]}
  />
);

const ServiceAccountsView = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>Hello ServiceAccounts!</p>
      </div>
    </PageLayout>
  );
};

export default ServiceAccountsView;
