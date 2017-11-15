import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { SubmissionError } from 'redux-form';
import { Container, Row, Col, PageLayout } from '../../common/components/web';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import settings from '../../../../../settings';

class ForgotPasswordView extends React.Component {
  state = {
    sent: false
  };

  onSubmit = ({ forgotPassword, onFormSubmitted }) => async values => {
    const result = await forgotPassword(values);

    if (result.errors) {
      let submitError = {
        _error: 'Reset password failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new SubmissionError(submitError);
    }

    this.setState({ sent: result });
    onFormSubmitted();
  };

  render() {
    const { forgotPassword, onFormSubmitted } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - Forgot Password`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - Forgot password page`
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
                  <h1 className="text-center">Password Reset</h1>
                  <ForgotPasswordForm
                    onSubmit={this.onSubmit({ forgotPassword, onFormSubmitted })}
                    sent={this.state.sent}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </PageLayout>
    );
  }
}

ForgotPasswordView.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  onFormSubmitted: PropTypes.func.isRequired
};

export default ForgotPasswordView;
