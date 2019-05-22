import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { LayoutCenter, PageLayout, Card, CardGroup, CardTitle, CardText, Button } from '@gqlapp/look-client-react';
import authentication from '@gqlapp/authentication-client-react';
import settings from '@gqlapp/config';

import getAndSaveTokensFromUrl from '../helpers/getAndSaveTokensFromUrl';
import LoginForm from './LoginForm';

const LoginView = ({ onSubmit, t, isRegistered, hideModal, history, client }) => {
  const {
    location: { search }
  } = history;

  const dataRegExp = /data=([^#]+)/;

  useEffect(() => {
    if (search && dataRegExp.test(search)) {
      checkTokensRedirectToProfile();
    }
  }, []);

  const checkTokensRedirectToProfile = async () => {
    await getAndSaveTokensFromUrl(search);
    await authentication.doLogin(client);
    history.push('profile');
  };

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

  const renderConfirmationModal = () => (
    <Card>
      <CardGroup style={{ textAlign: 'center' }}>
        <CardTitle>{t('reg.successRegTitle')}</CardTitle>
        <CardText>{t('reg.successRegBody')}</CardText>
        <CardText>
          <Button style={{ minWidth: '320px' }} color="primary" onClick={hideModal}>
            {t('login.form.btnSubmit')}
          </Button>
        </CardText>
      </CardGroup>
    </Card>
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <LayoutCenter>
        {isRegistered ? (
          renderConfirmationModal()
        ) : (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </LayoutCenter>
    </PageLayout>
  );
};

LoginView.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func,
  isRegistered: PropTypes.bool,
  hideModal: PropTypes.func,
  client: PropTypes.object,
  history: PropTypes.object
};

export default LoginView;
