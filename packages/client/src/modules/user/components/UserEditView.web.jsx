import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { pick } from 'lodash';
import { PageLayout } from '../../common/components/web';

import UserForm from './UserForm';
import settings from '../../../../../../settings';
import translate from '../../../i18n';

class UserEditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
    error: PropTypes.string,
    addUser: PropTypes.func.isRequired,
    history: PropTypes.object,
    t: PropTypes.func,
    editUser: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && nextProps.error) {
      this.props.history.push('/profile');
    }
  }

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
      throw result.errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: t('userEdit.errorMsg') }
      );
    }
  };

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
    const { loading, user, t } = this.props;
    console.log(user);

    if (loading && !user) {
      return (
        <PageLayout>
          {this.renderMetaData(t)}
          <div className="text-center">{t('editUser.loadMsg')}</div>
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {this.renderMetaData(t)}
          <Link id="back-button" to={user && user.role === 'admin' ? '/users' : '/profile'}>
            Back
          </Link>
          <h2>
            {t(`userEdit.form.${user ? 'titleEdit' : 'titleCreate'}`)} {t('userEdit.form.title')}
          </h2>
          <UserForm onSubmit={this.onSubmit} initialValues={user || {}} />
        </PageLayout>
      );
    }
  }
}

export default translate('user')(UserEditView);
