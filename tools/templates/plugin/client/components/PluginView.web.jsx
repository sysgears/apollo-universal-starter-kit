import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="$Plugin$"
    meta={[
      {
        name: 'description',
        content: '$Plugin$ page'
      }
    ]}
  />
);

const $Plugin$View = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>Hello $Plugin$!</p>
      </div>
    </PageLayout>
  );
};

export default $Plugin$View;
