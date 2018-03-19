import React from 'react';
import Helmet from 'react-helmet';

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
    <section>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>Hello $Module$!</p>
      </div>
    </section>
  );
};

export default $Module$View;
