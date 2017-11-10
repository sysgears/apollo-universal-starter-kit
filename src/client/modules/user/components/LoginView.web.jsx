// Web only component

// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { SubmissionError } from 'redux-form';

import { PageLayout, Card, CardGroup, CardTitle, CardText } from '../../common/components/web';
import LoginForm from '../components/LoginForm';

class LoginView extends React.PureComponent {
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
        title="Login"
        meta={[
          {
            name: 'description',
            content: 'Login page'
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <h1>Login page!</h1>
        <LoginForm onSubmit={this.onSubmit(login)} />
        <Link to="/forgot-password">Forgot your password?</Link>
        <hr />
        <Card>
          <CardGroup>
            <CardTitle>Available logins:</CardTitle>
            <CardText>admin@example.com:admin</CardText>
            <CardText>user@example.com:user</CardText>
          </CardGroup>
        </Card>
      </PageLayout>
    );
  }
}

LoginView.propTypes = {
  login: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default LoginView;
