/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { PageLayout } from '../../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="User Profile"
    meta={[
      {
        name: 'description',
        content: 'User Profile Page - Public'
      }
    ]}
  />
);

class ProfilePublicView extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render() {
    console.log('Public Profile Props', this.props);
    let { loading, user } = this.props;
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center mt-4 mb-4">
          <h2>{user.displayName || user.email} - Public Profile</h2>
        </div>
      </PageLayout>
    );
  }
}

export default ProfilePublicView;
