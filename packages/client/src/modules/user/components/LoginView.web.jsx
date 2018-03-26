import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { translate } from 'react-i18next';

import LoginForm from '../components/LoginForm';
import { LayoutCenter } from '../../common/components';
import { PageLayout, Card, CardGroup, CardTitle, CardText } from '../../common/components/web';

import settings from '../../../../../../settings';

class LoginView extends React.PureComponent {
  static propTypes = {
    error: PropTypes.string,
    login: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onSubmit = login => async values => {
    const result = await login(values);
    const { t } = this.props;

    if (result && result.errors) {
      let submitError = {
        _error: t('login.errorMsg')
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw submitError;
    }
  };

  render() {
    const { login, t } = this.props;

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
          <LoginForm onSubmit={this.onSubmit(login)} />
          <hr />
          <Card>
            <CardGroup>
              <CardTitle>{t('login.cardTitle')}:</CardTitle>
              <CardText>admin@example.com:admin</CardText>
              <CardText>user@example.com:user</CardText>
              {settings.subscription.enabled && <CardText>subscriber@example.com:subscriber</CardText>}
            </CardGroup>
          </Card>
        </LayoutCenter>
      </PageLayout>
    );
  }
}

export default translate('user')(LoginView);
