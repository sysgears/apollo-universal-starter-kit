import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { SubmissionError } from 'redux-form';
import { LayoutCenter } from '../../common/components';
import { PageLayout, Card, CardGroup, CardTitle, CardText } from '../../common/components/web';

import LoginForm from '../components/LoginForm';
import settings from '../../../../../settings';

export default class LoginView extends React.PureComponent {
  static propTypes = {
    error: PropTypes.string,
    login: PropTypes.func.isRequired
  };

  onSubmit = login => async values => {
    const result = await login(values);

    if (result.errors) {
      let submitError = {
        _error: 'Login failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new SubmissionError(submitError);
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
