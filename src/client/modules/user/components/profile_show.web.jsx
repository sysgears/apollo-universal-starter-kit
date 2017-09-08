// Web only component
// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import PageLayout from '../../../app/page_layout';

const ProfileShow = ({ loading, currentUser }) => {

  const renderMetaData = () => (
    <Helmet
      title="Profile"
      meta={[{
        name: 'description',
        content: 'Profile page'
      }]}/>
  );

  if (loading && !currentUser) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">
          Loading...
        </div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <h2>Profile</h2>
        <p>username: {currentUser.username}</p>
        <p>email: {currentUser.email}</p>
        { currentUser.isAdmin &&
          <p>is admin: {currentUser.isAdmin.toString()}</p>
        }
      </PageLayout>
    );
  }
};

ProfileShow.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

export default ProfileShow;
