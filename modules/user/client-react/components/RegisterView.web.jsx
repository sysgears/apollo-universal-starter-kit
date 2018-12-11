import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { translate } from '@module/i18n-client-react';
import { LayoutCenter, PageLayout } from '@module/look-client-react';
import { FieldError } from '@module/validation-common-react';

import RegisterForm from '../components/RegisterForm';

import settings from '../../../../settings';

class RegisterView extends React.PureComponent {
  static propTypes = {
    register: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = async values => {
    const { register, t } = this.props;
    const errors = new FieldError((await register(values)).errors);

    throw { ...errors.errors, validErr: t('reg.errorMsg') };
  };

  renderMetaData = t => (
    <Helmet
      title={`${settings.app.name} - ${t('reg.title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('reg.meta')}`
        }
      ]}
    />
  );

  render() {
    const { t } = this.props;
    return (
      <PageLayout>
        {this.renderMetaData(t)}
        <LayoutCenter>
          <h1 className="text-center">{t('reg.form.title')}</h1>
          <RegisterForm onSubmit={this.onSubmit} />
        </LayoutCenter>
      </PageLayout>
    );
  }
}

export default translate('user')(RegisterView);
