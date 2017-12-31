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
        content: 'User Profile Page - Private'
      }
    ]}
  />
);

class UserProfilePrivateView extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  renderUser = () => {
    let { user } = this.props;
    return <h2>{user.displayName || user.email} - Private Profile</h2>;
  };

  render() {
    let { loading, user } = this.props;
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center mt-4 mb-4">
          {loading ? <h3>loading...</h3> : !user ? <h3>no user</h3> : this.renderUser()}
        </div>
      </PageLayout>
    );
  }
}

export default UserProfilePrivateView;
