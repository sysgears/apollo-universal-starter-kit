import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { LayoutCenter, PageLayout, Card, CardGroup, CardTitle, CardText } from '@gqlapp/look-client-react';

import LoginForm from './LoginForm';
import settings from '../../../../settings';

const LoginView = ({ onSubmit, t }) => {
  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${t('login.title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('login.meta')}`
        }
      ]}
    />
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <LayoutCenter>
        <h1 className="text-center">{t('login.form.title')}</h1>
        <LoginForm onSubmit={onSubmit} />
        <hr />
        <Card>
          <CardGroup>
            <CardTitle>{t('login.cardTitle')}:</CardTitle>
            <CardText>admin@example.com:admin123</CardText>
            <CardText>user@example.com:user1234</CardText>
          </CardGroup>
        </Card>
      </LayoutCenter>
    </PageLayout>
  );
};

LoginView.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default LoginView;
