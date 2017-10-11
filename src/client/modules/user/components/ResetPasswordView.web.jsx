// Web only component

// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import PageLayout from '../../../app/PageLayout';
import ResetPasswordForm from '../components/ResetPasswordForm';

class ResetPasswordView extends React.Component {
  state = {
    errors: [],
    sent: false
  };

  onSubmit = ({ resetPassword, onFormSubmitted }) => async values => {
    const result = await resetPassword(values);

    if (result.errors) {
      this.setState({ errors: result.errors });
      return;
    }

    this.setState({ sent: result });
    onFormSubmitted();
  };

  render() {
    const { resetPassword, onFormSubmitted } = this.props;

    const renderMetaData = () => (
      <Helmet
        title="Reset Password"
        meta={[
          {
            name: 'description',
            content: 'Reset password page'
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <h1>Reset password!</h1>
        <ResetPasswordForm
          onSubmit={this.onSubmit({ resetPassword, onFormSubmitted })}
          errors={this.state.errors}
          sent={this.state.sent}
        />
      </PageLayout>
    );
  }
}

ResetPasswordView.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  onFormSubmitted: PropTypes.func.isRequired
};

export default ResetPasswordView;
