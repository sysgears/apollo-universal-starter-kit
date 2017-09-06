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
          const loginData = await mutate({
            variables: { input: { email, password } },
          });

          const { token, refreshToken } = loginData.data.login;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);

          if (history) {
            return history.push('/profile');
          }
          else if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          return { errors: e.graphQLErrors };
         }
      }
    })
  }),
)(User);

export default UserWithApollo;
