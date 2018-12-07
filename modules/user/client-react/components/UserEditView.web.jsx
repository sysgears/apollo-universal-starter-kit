import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { translate } from '@module/i18n-client-react';
import { PageLayout } from '@module/look-client-react';

import UserForm from './UserForm';
import settings from '../../../../settings';

class UserEditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
    currentUser: PropTypes.object,
    errors: PropTypes.array,
    history: PropTypes.object,
    t: PropTypes.func,
    editUser: PropTypes.func.isRequired,
    onSubmit: PropTypes.func
  };

  state = {};

  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.loading && nextProps.errors && nextProps.errors.length) {
      nextProps.history.push('/profile');
    }
    return null;
  }

  renderMetaData = t => (
    <Helmet
      title={`${settings.app.name} - ${t('userEdit.title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('userEdit.meta')}`
        }
      ]}
    />
  );

  render() {
    const { loading, user, t, currentUser } = this.props;

    if (loading && !user) {
      return (
        <PageLayout>
          {this.renderMetaData(t)}
          <div className="text-center">{t('userEdit.loadMsg')}</div>
        </PageLayout>
      );
    } else {
      const isNotSelf = !user || (user && user.id !== currentUser.id);
      return (
        <PageLayout>
          {this.renderMetaData(t)}
          <Link id="back-button" to={user && user.role === 'admin' ? '/users' : '/profile'}>
            Back
          </Link>
          <h2>
            {t('userEdit.form.titleEdit')} {t('userEdit.form.title')}
          </h2>
          <UserForm
            onSubmit={this.props.onSubmit}
            shouldDisplayRole={isNotSelf}
            shouldDisplayActive={isNotSelf}
            initialValues={user}
          />
        </PageLayout>
      );
    }
  }
}

export default translate('user')(UserEditView);
