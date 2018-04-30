// React
import React from 'react';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import RegisterView from '../components/RegisterView';

import REGISTER from '../graphql/Register.graphql';

import settings from '../../../../../../settings';

class Register extends React.Component {
  render() {
    return <RegisterView {...this.props} />;
  }
}

const RegisterWithApollo = compose(
  graphql(REGISTER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      register: async ({ username, email, password }) => {
        try {
          const {
            data: { register }
          } = await mutate({
            variables: { input: { username, email, password } }
          });

          if (register.errors) {
            return { errors: register.errors };
          }
          if (history) {
            if (settings.subscription.enabled) {
              return history.push('/subscription');
            }
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
