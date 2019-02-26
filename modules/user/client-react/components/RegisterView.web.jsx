import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { translate } from '@gqlapp/i18n-client-react';
import { LayoutCenter, PageLayout } from '@gqlapp/look-client-react';

import RegisterForm from '../components/RegisterForm';

import settings from '../../../../settings';

const RegisterView = ({ t, onSubmit }) => {
  const renderMetaData = () => (
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

  return (
    <PageLayout>
      {renderMetaData(t)}
      <LayoutCenter>
        <h1 className="text-center">{t('reg.form.title')}</h1>
        <RegisterForm onSubmit={onSubmit} />
      </LayoutCenter>
    </PageLayout>
  );
};

RegisterView.propTypes = {
  t: PropTypes.func,
  onSubmit: PropTypes.func
};

export default translate('user')(RegisterView);
