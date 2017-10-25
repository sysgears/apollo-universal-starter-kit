import React from 'react';
import { graphql, compose } from 'react-apollo';

import UserEditView from '../components/UserEditView';

import USER_QUERY from '../graphql/UserQuery.graphql';
import ADD_USER from '../graphql/AddUser.graphql';
import EDIT_USER from '../graphql/EditUser.graphql';

class UserEdit extends React.Component {
  render() {
    return <UserEditView {...this.props} />;
  }
}

export default compose(
  graphql(USER_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id }
      };
    },
    props({ data: { loading, user } }) {
      return { loading, user };
    }
  }),
  graphql(ADD_USER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      addUser: async input => {
        try {
          const { data: { addUser } } = await mutate({
            variables: { input }
          });

          if (addUser.errors) {
            return { errors: addUser.errors };
          }

          if (history) {
            return history.push('/users');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(EDIT_USER, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      editUser: async input => {
        try {
          const { data: { editUser } } = await mutate({
            variables: { input }
          });

          if (editUser.errors) {
            return { errors: editUser.errors };
          }

          if (history) {
            return history.push('/users');
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
)(UserEdit);
