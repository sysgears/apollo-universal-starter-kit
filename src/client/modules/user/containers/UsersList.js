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
  errors: PropTypes.array
};

const UsersListWithApollo = compose(
  graphql(USERS_QUERY, {
    options: ({ orderBy, searchText, isAdmin }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          orderBy: orderBy,
          filter: { searchText, isAdmin }
        }
      };
    },
    props({ data: { loading, users, error } }) {
      return { loading, users, errors: error ? error.graphQLErrors : null };
    }
  }),
  graphql(DELETE_USER, {
    props: ({ ownProps: { orderBy, searchText, isAdmin }, mutate }) => ({
      deleteUser: async id => {
        try {
          const { data: { deleteUser } } = await mutate({
            variables: { id },
            refetchQueries: [
              {
                query: USERS_QUERY,
                variables: {
                  orderBy: orderBy,
                  filter: { searchText, isAdmin }
                }
              }
            ]
          });
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
