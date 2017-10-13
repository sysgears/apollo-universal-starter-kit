/*eslint-disable no-unused-vars*/
// React
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import UsersListView from '../components/UsersListView';

import USERS_QUERY from '../graphql/UsersQuery.graphql';
import DELETE_USER from '../graphql/DeleteUser.graphql';

class UsersList extends React.Component {
  render() {
    return <UsersListView {...this.props} />;
  }
}

UsersList.propTypes = {
  loading: PropTypes.bool.isRequired,
  users: PropTypes.array,
  errors: PropTypes.array,
  refetch: PropTypes.func.isRequired
};

const UsersListWithApollo = compose(
  graphql(USERS_QUERY, {
    options: ({ orderBy, searchText, isAdmin, isActive }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          orderBy: orderBy,
          filter: { searchText, isAdmin, isActive }
        }
      };
    },
    props({ data: { loading, users, refetch, error } }) {
      return { loading, users, refetch, errors: error ? error.graphQLErrors : null };
    }
  }),
  graphql(DELETE_USER, {
    props: ({ ownProps: { orderBy, searchText, isAdmin, refetch }, mutate }) => ({
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
)(UsersList);

export default connect(
  state => ({
    searchText: state.user.searchText,
    isAdmin: state.user.isAdmin,
    isActive: state.user.isActive,
    orderBy: state.user.orderBy
  }),
  dispatch => ({
    onOrderBy(orderBy) {
      dispatch({
        type: 'USER_ORDER_BY',
        value: orderBy
      });
    }
  })
)(UsersListWithApollo);
