import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { translate } from '@module/i18n-client-react';
import { LayoutCenter, PageLayout } from '@module/look-client-react';

import RegisterForm from '../components/RegisterForm';

import settings from '../../../../settings';

class RegisterView extends React.PureComponent {
  static propTypes = {
    t: PropTypes.func,
    onSubmit: PropTypes.func
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
    const { t, onSubmit } = this.props;
    return (
      <PageLayout>
        {this.renderMetaData(t)}
        <LayoutCenter>
          <h1 className="text-center">{t('reg.form.title')}</h1>
          <RegisterForm onSubmit={onSubmit} />
        </LayoutCenter>
      </PageLayout>
    );
  }
}

export default translate('user')(RegisterView);
