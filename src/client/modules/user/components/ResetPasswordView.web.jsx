import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { SubmissionError } from 'redux-form';
import { PageLayout } from '../../common/components/web';

import ResetPasswordForm from '../components/ResetPasswordForm';
import settings from '../../../../../settings';

export default class ResetPasswordView extends React.Component {
  static propTypes = {
    resetPassword: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        token: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  onSubmit = resetPassword => async values => {
    const result = await resetPassword({
      ...values,
      token: this.props.match.params.token
    });

    if (result.errors) {
      let submitError = {
        _error: 'Reset Password failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new SubmissionError(submitError);
    }
  };

  render() {
    const { resetPassword } = this.props;

    const renderMetaData = () => (
      <Helmet
        title={`${settings.app.name} - Reset Password`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - Reset password page`
          }
        ]}
      />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <h1>Reset password!</h1>
        <ResetPasswordForm onSubmit={this.onSubmit(resetPassword)} />
      </PageLayout>
    );
  }
}
