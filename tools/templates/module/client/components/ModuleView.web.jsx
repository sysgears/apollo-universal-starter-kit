import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="$Module$"
    meta={[
      {
        name: 'description',
        content: '$Module$ page'
      }
    ]}
  />
);

const $Module$View = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center">
        <p>Hello $Module$!</p>
      </div>
    </PageLayout>
  );
};

export default $Module$View;
