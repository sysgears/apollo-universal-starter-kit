/* eslint-disable no-undef */
// React
import React from 'react';
import PropTypes from 'prop-types';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import LoginShow from '../components/login_show.web';

import USER_LOGIN from '../graphql/user_login.graphql';

class User extends React.Component {
  render() {
    return <LoginShow {...this.props} />;
  }
}

User.propTypes = {
  login: PropTypes.func.isRequired,
  data: PropTypes.object,
};

const UserWithApollo = compose(
  graphql(USER_LOGIN, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      login: async ({ email, password }) => {
        try {
          const { data: { login } } = await mutate({
            variables: { input: { email, password } },
          });

          if (login.errors) {
            return { errors: login.errors };
          }

          const { token, refreshToken } = login.tokens;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);

          if (history) {
            return history.push('/profile');
          }
          else if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
)(User);

export default UserWithApollo;
