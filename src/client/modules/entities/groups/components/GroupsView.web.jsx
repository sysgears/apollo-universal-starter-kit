import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="Groups"
    meta={[
      {
        name: 'description',
        content: 'Groups page'
      }
    ]}
  />
);

const GroupsView = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>Hello Groups!</p>
      </div>
    </PageLayout>
  );
};

export default GroupsView;
