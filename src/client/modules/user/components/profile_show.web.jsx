// Web only component
// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import PageLayout from '../../../app/page_layout';

const ProfileShow = ({ currentUser: { username, email, isAdmin } }) => {

  const renderMetaData = () => (
    <Helmet
      title="Profile"
      meta={[{
        name: 'description',
        content: 'Profile page'
      }]}/>
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <h2>Profile</h2>
      <p>username: {username}</p>
      <p>email: {email}</p>
      <p>is admin: {isAdmin.toString()}</p>
    </PageLayout>
  );
};

ProfileShow.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

export default ProfileShow;
