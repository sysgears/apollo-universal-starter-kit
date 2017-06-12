import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

const [Module]Show = () => {

  const renderMetaData = () => (
    <Helmet
      title="[Module]"
      meta={[{
        name: 'description',
        content: '[Module] page'
      }]}/>
  );

  return (
    <div>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>
          Hello [Module]!
        </p>
      </div>
    </div>
  );
};

[Module]Show.propTypes = {
};

export default [Module]Show;
