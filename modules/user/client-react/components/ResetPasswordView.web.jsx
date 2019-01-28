import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { PageLayout } from '@gqlapp/look-client-react';

import ResetPasswordForm from '../components/ResetPasswordForm';

import settings from '../../../../settings';

const ResetPasswordView = ({ t, onSubmit }) => {
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
      <h1>{t('resetPass.form.title')}</h1>
      <ResetPasswordForm onSubmit={onSubmit} />
    </PageLayout>
  );
};

ResetPasswordView.propTypes = {
  t: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
};

export default ResetPasswordView;
