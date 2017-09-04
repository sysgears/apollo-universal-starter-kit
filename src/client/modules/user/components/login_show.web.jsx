// Web only component

// React
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import PageLayout from '../../../app/page_layout';
import LoginForm from '../components/login_form';

class UserShow extends React.PureComponent {
  state = {
    errors: [],
  };
  
  onSubmit = (login) => async (values) => {
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
        meta={[{
          name: 'description',
          content: 'Login page'
        }]} />
    );

    return (
      <PageLayout>
        {renderMetaData()}
        <h1>Login page!</h1>
        <LoginForm onSubmit={this.onSubmit(login)} />
        {this.state.errors.map(error => (
          <li key={error.path[0]}>{error.message}</li>
        ))}
      </PageLayout>
    );
  }
};

UserShow.propTypes = {
  login: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default UserShow;
