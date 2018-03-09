import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { LayoutCenter } from '../../common/components';
import { PageLayout, Card, CardGroup, CardTitle, CardText } from '../../common/components/web';

import LoginForm from './LoginForm';
import settings from '../../../../../../settings';

export default class LoginView extends React.PureComponent {
  static propTypes = {
    error: PropTypes.string,
    login: PropTypes.func.isRequired
  };

  onSubmit = login => async values => {
    const { errors } = await login(values);

    if (errors && errors.length) {
      throw errors.reduce(
        (res, error) => {
          res[error.field] = error.message;
          return res;
        },
        { _error: 'Login failed!' }
      );
    }
  };

  render() {
    const { login } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - Login`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - Login page`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">Sign In</h1>
          <LoginForm onSubmit={this.onSubmit(login)} />
          <hr />
          <Card>
            <CardGroup>
              <CardTitle>Available logins:</CardTitle>
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
