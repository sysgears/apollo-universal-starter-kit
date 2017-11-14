// Web only component

// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { SubmissionError } from 'redux-form';
import { Container, Row, Col } from 'reactstrap';
import { PageLayout } from '../../common/components/web';
import RegisterForm from '../components/RegisterForm';

class RegisterView extends React.PureComponent {
  onSubmit = async values => {
    const { register } = this.props;
    const result = await register(values);

    if (result.errors) {
      let submitError = {
        _error: 'Registration failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new SubmissionError(submitError);
    }
  };

  renderMetaData = () => (
    <Helmet
      title="Register"
      meta={[
        {
          name: 'description',
          content: 'Register page'
        }
      ]}
    />
  );

  render() {
    return (
      <PageLayout>
        {this.renderMetaData()}
        <Container>
          <Row>
            <Col xs={{ size: 6, offset: 3 }}>
              <Row>
                <Col>
                  <h1 className="text-center">Sign Up</h1>
                  <RegisterForm onSubmit={this.onSubmit} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </PageLayout>
    );
  }
}

RegisterView.propTypes = {
  register: PropTypes.func.isRequired
};

export default RegisterView;
