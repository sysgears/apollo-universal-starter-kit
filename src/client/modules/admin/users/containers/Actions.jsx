// React
import React from 'react';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import UsersActionsView from '../components/ActionsView';

import ADD_USER from '../graphql/AddUser.graphql';
import DELETE_USER from '../graphql/DeleteUser.graphql';

class UsersActions extends React.Component {
  render() {
    return <UsersActionsView {...this.props} />;
  }
}

const UsersActionsWithApollo = compose(
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
  graphql(DELETE_USER, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteUser: async id => {
        try {
          const { data: { deleteUser } } = await mutate({
            variables: { id }
          });

          // refeatch USERS_QUERY
          refetch();

          if (deleteUser.errors) {
            return { errors: deleteUser.errors };
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(UsersActions);

export default connect(
  state => ({
    searchText: state.users.searchText,
    role: state.users.role,
    isActive: state.users.isActive,
    orderBy: state.users.orderBy
  }),
  dispatch => ({
    onOrderBy(orderBy) {
      dispatch({
        type: 'USER_ORDER_BY',
        value: orderBy
      });
    }
  })
)(UsersActionsWithApollo);
