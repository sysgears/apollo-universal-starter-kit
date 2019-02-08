import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';
import Helmet from 'react-helmet';

import { LayoutCenter, PageLayout, Card, CardGroup, CardTitle, CardText } from '@gqlapp/look-client-react';
import access from '../access';

import LoginForm from './LoginForm';
import settings from '../../../../settings';

class LoginView extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    t: PropTypes.func,
    login: PropTypes.func,
    onLogin: PropTypes.func,
    client: PropTypes.object,
    loginWithProvider: PropTypes.func
  };

  state = {
    firebaseError: false
  };

  componentDidMount() {
    // redirect from socials provider
    this.handleRedirectResult();
  }

  async componentWillUnmount() {
    await firebase.app().delete();
    await firebase.initializeApp(settings.firebase.config.clientData);
  }

  handleRedirectResult = async () => {
    const { client, onLogin, loginWithProvider } = this.props;
    try {
      const { user, additionalUserInfo } = await firebase.auth().getRedirectResult();
      if (user) {
        await loginWithProvider(user, additionalUserInfo);
        await access.doLogin(client);
        if (onLogin) {
          onLogin();
        }
      }
    } catch (e) {
      if (e.code === 'auth/account-exists-with-different-credential') {
        this.setState(() => ({ firebaseError: true }));
      }
    }
  };

  renderMetaData = () => {
    const { t } = this.props;

    return (
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
  };

  render() {
    const { onSubmit, t } = this.props;
    const { firebaseError } = this.state;

    return (
      <PageLayout>
        {this.renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">{t('login.form.title')}</h1>
          <LoginForm onSubmit={onSubmit} firebaseError={firebaseError} />
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
  }
}

export default LoginView;
