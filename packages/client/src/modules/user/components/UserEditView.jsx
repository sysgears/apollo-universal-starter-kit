import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { pick } from 'lodash';
import { translate } from 'react-i18next';

import UserForm from './UserForm';
import { PageLayout } from '../../common/components/web';

import settings from '../../../../../../settings';

class UserEditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
    addUser: PropTypes.func.isRequired,
    editUser: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = async values => {
    const { user, addUser, editUser, t } = this.props;
    let result = null;

    let insertValues = pick(values, ['username', 'email', 'role', 'isActive', 'password']);

    insertValues['profile'] = pick(values.profile, ['firstName', 'lastName']);

    if (settings.user.auth.certificate.enabled) {
      insertValues['auth'] = { certificate: pick(values.auth.certificate, 'serial') };
    }

    if (user) {
      result = await editUser({ id: user.id, ...insertValues });
    } else {
      result = await addUser(insertValues);
    }

    if (result && result.errors) {
      let submitError = {
        _error: t('userEdit.errorMsg')
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw submitError;
    }
  };

  renderMetaData = () => {
    const { t } = this.props;
    return (
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
  };

  render() {
    const { loading, user, t } = this.props;

    if (loading && !user) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">{t('userEdit.loadMsg')}</div>
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <Link id="back-button" to="/users">
            Back
          </Link>
          <h2>
            {user ? t('userEdit.form.titleEdit') : t('userEdit.form.titleCreate')} {t('userEdit.form.title')}
          </h2>
          <UserForm onSubmit={this.onSubmit} initialValues={user || {}} />
        </PageLayout>
      );
    }
  }
}

export default translate('user')(UserEditView);
