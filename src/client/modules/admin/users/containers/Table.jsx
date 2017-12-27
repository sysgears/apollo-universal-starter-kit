// React
import React from 'react';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import UsersTableView from '../components/TableView';

import DELETE_USER from '../graphql/DeleteUser.graphql';

class UsersTable extends React.Component {
  render() {
    return <UsersTableView {...this.props} />;
  }
}

const UsersTableWithApollo = compose(
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
)(UsersTable);

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
)(UsersTableWithApollo);
