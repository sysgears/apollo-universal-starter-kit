import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { LayoutCenter, PageLayout } from '@gqlapp/look-client-react';

import ForgotPasswordForm from '../components/ForgotPasswordForm';
import settings from '../../../../settings';

const ForgotPasswordView = ({ onSubmit, t, sent }) => {
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
        <ForgotPasswordForm onSubmit={onSubmit} sent={sent} />
      </LayoutCenter>
    </PageLayout>
  );
};

ForgotPasswordView.propTypes = {
  onSubmit: PropTypes.func,
  forgotPassword: PropTypes.func,
  sent: PropTypes.bool,
  t: PropTypes.func
};

export default ForgotPasswordView;
