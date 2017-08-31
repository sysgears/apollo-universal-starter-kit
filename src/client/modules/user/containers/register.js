// React
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import RegisterShow from '../components/register_show.web';

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
      register: async ({ username, email, password, isAdmin }) => {
        const userData = await mutate({
          variables: { input: { username, email, password, isAdmin } },
          //optimisticResponse: {
          //  register: {
          //    id: -1,
          //    username: username,
          //    email: email,
          //    isAdmin: isAdmin,
          //    __typename: 'User',
          //  },
          //},
          //updateQueries: {
          //  getPosts: (prev, { mutationResult: { data: { addPost } } }) => {
          //    return AddPost(prev, addPost);
          //  }
          //}
        });

        console.log(userData);

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
