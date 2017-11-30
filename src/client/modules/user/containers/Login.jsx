/* eslint-disable no-undef */
// React
import React from 'react';
import { withRouter } from 'react-router-dom';

// Apollo
import { graphql, withApollo, compose } from 'react-apollo';

// Components
import LoginView from '../components/LoginView';
import log from '../../../../common/log';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGIN from '../graphql/Login.graphql';

class Login extends React.Component {
  render() {
    return <LoginView {...this.props} />;
  }
}

const LoginWithApollo = compose(
  withApollo,
  withRouter,
  graphql(LOGIN, {
    props: ({ ownProps: { history, client, navigation }, mutate }) => ({
      login: async ({ email, password }) => {
        try {
          const { data: { login } } = await mutate({
            variables: { input: { email, password } }
          });

          if (login.errors) {
            return { errors: login.errors };
          }

          await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: login.user } });

          if (history) {
            return history.push('/profile');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          log.error(e);
        }
      }
    })
  })
)(Login);

export default LoginWithApollo;
