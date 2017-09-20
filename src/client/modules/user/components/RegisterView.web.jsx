// Web only component

// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import PageLayout from '../../../app/PageLayout';
import RegisterForm from '../components/RegisterForm';

class RegisterView extends React.PureComponent {
  state = {
    errors: []
  };

  onSubmit = register => async values => {
    const result = await register(values);

    if (result.errors) {
      this.setState({ errors: result.errors });
    }
  };

  render() {
    const { register } = this.props;

    const renderMetaData = () => (
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

    return (
      <PageLayout>
        {renderMetaData()}
        <h1>Register page!</h1>
        <RegisterForm onSubmit={this.onSubmit(register)} errors={this.state.errors} />
      </PageLayout>
    );
  }
}

RegisterView.propTypes = {
  register: PropTypes.func.isRequired
};

export default RegisterView;
