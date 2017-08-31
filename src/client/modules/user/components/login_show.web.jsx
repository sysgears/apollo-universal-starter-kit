// Web only component

/*eslint-disable no-unused-vars*/
// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import PageLayout from '../../../app/page_layout';

const UserShow = () => {

  const renderMetaData = () => (
    <Helmet
      title="Login"
      meta={[{
        name: 'description',
        content: 'Login page'
      }]}/>
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>
          Login page!
        </p>
      </div>
    </PageLayout>
  );
};

UserShow.propTypes = {
};

export default UserShow;
