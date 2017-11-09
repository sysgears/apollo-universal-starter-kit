// React
import React from 'react';
import PropTypes from 'prop-types';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import RegisterView from '../components/RegisterView';

import REGISTER from '../graphql/Register.graphql';

class Register extends React.Component {
  render() {
    return <RegisterView {...this.props} />;
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired
};

const RegisterWithApollo = compose(
  graphql(REGISTER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      register: async ({ username, email, password }) => {
        try {
          const { data: { register } } = await mutate({
            variables: { input: { username, email, password } }
          });

          if (register.errors) {
            return { errors: register.errors };
          }
          if (history) {
            return history.push('/profile');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(Register);

export default RegisterWithApollo;
