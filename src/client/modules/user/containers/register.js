// React
import React from 'react';
import PropTypes from 'prop-types';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import RegisterShow from '../components/register_show';

import USER_REGISTER from '../graphql/user_register.graphql';

class User extends React.Component {

  render() {
    return <RegisterShow {...this.props}/>;
  }
}

User.propTypes = {
  register: PropTypes.func.isRequired,
};

const UserWithApollo = compose(
  graphql(USER_REGISTER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      register: async ({ username, email, password }) => {
        try {
          const { data: { register } } = await mutate({
            variables: { input: { username, email, password } },
          });

          if (register.errors) {
            return { errors: register.errors };
          }

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
