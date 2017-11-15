import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { SubmissionError } from 'redux-form';

import { PageLayout, Container, Row, Col, Card, CardGroup, CardTitle, CardText } from '../../common/components/web';
import LoginForm from '../components/LoginForm';
import settings from '../../../../../settings';

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
        <Container>
          <Row>
            <Col xs={{ size: 6, offset: 3 }}>
              <Row>
                <Col>
                  <h1 className="text-center">Sign In</h1>
                  <LoginForm onSubmit={this.onSubmit(login)} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card>
                    <CardGroup>
                      <CardTitle>Available logins:</CardTitle>
                      <CardText>admin@example.com:admin</CardText>
                      <CardText>user@example.com:user</CardText>
                    </CardGroup>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </PageLayout>
    );
  }
}

LoginView.propTypes = {
  login: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default LoginView;
