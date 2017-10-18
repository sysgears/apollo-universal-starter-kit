// Web only component

// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

class ForgotPasswordView extends React.Component {
  state = {
    errors: [],
    sent: false
  };

  onSubmit = ({ forgotPassword, onFormSubmitted }) => async values => {
    const result = await forgotPassword(values);

    if (result.errors) {
      this.setState({ errors: result.errors });
      return;
    }

    this.setState({ sent: result });
    onFormSubmitted();
  };

  render() {
    const { forgotPassword, onFormSubmitted } = this.props;

    const renderMetaData = () => (
      <Helmet
        title="Forgot Password"
        meta={[
          {
            name: 'description',
            content: 'Forgot password page'
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <h1>Forgot password!</h1>
        <ForgotPasswordForm
          onSubmit={this.onSubmit({ forgotPassword, onFormSubmitted })}
          errors={this.state.errors}
          sent={this.state.sent}
        />
      </PageLayout>
    );
  }
}

ForgotPasswordView.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  onFormSubmitted: PropTypes.func.isRequired
};

export default ForgotPasswordView;
