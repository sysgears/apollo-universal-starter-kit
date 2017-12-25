import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../../common/components/web';

import settings from '../../../../../../settings';

export default class UserEditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object
  };

  renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - View User`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - View user example page`
        }
      ]}
    />
  );

  render() {
    const { loading, user } = this.props;

    console.log('UserView.render', loading, user);

    if (loading) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else if (!user) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">Unknown user</div>
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <Link id="back-button" to="/users">
            Back
          </Link>
          <Link id="back-button" to={'/users/' + user.id + '/edit'}>
            Edit
          </Link>
          <h2>{user.profile.displayName}</h2>
        </PageLayout>
      );
    }
  }
}
