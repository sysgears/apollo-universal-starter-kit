import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { translate } from 'react-i18next';

import ResetPasswordForm from '../components/ResetPasswordForm';
import { PageLayout } from '../../common/components/web';

import settings from '../../../../../../settings';

class ResetPasswordView extends React.Component {
  static propTypes = {
    resetPassword: PropTypes.func.isRequired,
    t: PropTypes.func,
    match: PropTypes.shape({
      params: PropTypes.shape({
        token: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  onSubmit = resetPassword => async values => {
    const result = await resetPassword({
      ...values,
      token: this.props.match.params.token
    });
    const { t } = this.props;

    if (result.errors) {
      let submitError = {
        _error: t('resetPass.errorMsg')
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw submitError;
    }
  };

  render() {
    const { resetPassword, t } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - ${t('resetPass.title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('resetPass.meta')}`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <h1>${t('resetPass.form.title')}</h1>
        <ResetPasswordForm onSubmit={this.onSubmit(resetPassword)} />
      </PageLayout>
    );
  }
}

export default translate('user')(ResetPasswordView);
