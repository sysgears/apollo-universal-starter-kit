import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { SubmissionError } from 'redux-form';
import { LayoutCenter } from '../../common/components';
import { PageLayout } from '../../common/components/web';

import RegisterForm from '../components/RegisterForm';
import settings from '../../../../../settings';

export default class RegisterView extends React.PureComponent {
  static propTypes = {
    register: PropTypes.func.isRequired
  };

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
      title={`${settings.app.name} - Register`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - Register page`
        }
      ]}
    />
  );

  render() {
    return (
      <PageLayout>
        {this.renderMetaData()}
        <LayoutCenter>
          <h1 className="text-center">Sign Up</h1>
          <RegisterForm onSubmit={this.onSubmit} />
        </LayoutCenter>
      </PageLayout>
    );
  }
}
