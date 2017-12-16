import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="Users"
    meta={[
      {
        name: 'description',
        content: 'Users page'
      }
    ]}
  />
);

const UsersView = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>Hello Users!</p>
      </div>
    </PageLayout>
  );
};

export default UsersView;
