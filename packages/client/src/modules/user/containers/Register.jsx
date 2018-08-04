import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';

import RegisterView from '../components/RegisterView';

import access from '../access';
import REGISTER from '../graphql/Register.graphql';
import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

class Register extends React.Component {
  render() {
    return <RegisterView {...this.props} />;
  }
}

const RegisterWithApollo = compose(
  withApollo,
  graphql(REGISTER, {
    props: ({ ownProps: { client, onRegister }, mutate }) => ({
      register: async ({ username, email, password }) => {
        try {
          const {
            data: { register }
          } = await mutate({
            variables: { input: { username, email, password } }
          });

          if (register.errors) {
            return { errors: register.errors };
          } else {
            await access.doLogin(client);
            await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: register.user } });
            if (onRegister) {
              onRegister();
            }
          }

          return register;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(Register);

export default RegisterWithApollo;
