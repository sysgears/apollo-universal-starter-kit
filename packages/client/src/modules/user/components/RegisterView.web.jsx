import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { translate } from 'react-i18next';

import RegisterForm from '../components/RegisterForm';
import { LayoutCenter } from '../../common/components';
import { PageLayout } from '../../common/components/web';

import settings from '../../../../../../settings';

class RegisterView extends React.PureComponent {
  static propTypes = {
    register: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = async values => {
    const { register, t } = this.props;
    const result = await register(values);

    if (result && result.errors) {
      let submitError = {
        _error: t('reg.errorMsg')
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw submitError;
    }
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
