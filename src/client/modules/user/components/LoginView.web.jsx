// Web only component

// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Card, CardBlock, CardTitle, CardText } from 'reactstrap';

import PageLayout from '../../../app/PageLayout';
import LoginForm from '../components/LoginForm';

class LoginView extends React.PureComponent {
  state = {
    errors: []
  };

  onSubmit = login => async values => {
    const result = await login(values);

    if (result.errors) {
      this.setState({ errors: result.errors });
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
        <LoginForm onSubmit={this.onSubmit(login)} errors={this.state.errors} />
        <hr />
        <Card>
          <CardBlock>
            <CardTitle>Available logins:</CardTitle>
            <CardText>admin@example.com:admin</CardText>
            <CardText>user@example.com:user</CardText>
          </CardBlock>
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
