import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import translate from '../../../i18n';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import { LayoutCenter } from '../../common/components';
import { Alert, PageLayout } from '../../common/components/web';

import settings from '../../../../../../settings';

class ForgotPasswordView extends React.Component {
  static propTypes = {
    forgotPassword: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  state = {
    sent: false
  };

  onSubmit = ({ forgotPassword, t }) => async values => {
    const result = await forgotPassword(values);
    if (result && result.errors) {
      throw result.errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: t('forgotPass.errorMsg') }
      );
    }

    this.setState({ sent: result });
  };

  render() {
    const { forgotPassword, t } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - ${t('forgotPass.title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('forgotPass.meta')}`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">{t('forgotPass.form.title')}</h1>
          {this.state.sent && <Alert color="success">{t('forgotPass.submitMsg')}</Alert>}
          <ForgotPasswordForm onSubmit={this.onSubmit({ forgotPassword, t })} />
        </LayoutCenter>
      </PageLayout>
    );
  }
}

export default translate('user')(ForgotPasswordView);
