// React
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import LoginShow from '../components/login_show.web';

import USER_LOGIN from '../graphql/user_login.graphql';

class User extends React.Component {

  render() {
    return <LoginShow  {...this.props}/>;
  }
}

User.propTypes = {
  login: PropTypes.func.isRequired,
};

const UserWithApollo = compose(
  graphql(USER_LOGIN, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      login: async ({ email, password }) => {
        const loginData = await mutate({
          variables: { input: { email, password } },
        });

        console.log(loginData);

        /*if (history) {
          return history.push('/posts');
          //return history.push('/post/' + postData.data.addPost.id);
        }
        else if (navigation) {
          return navigation.goBack();
        }*/
      }
    })
  }),
)(User);

export default connect(
  (state) => ({}),
  (dispatch) => ({}),
)(UserWithApollo);
