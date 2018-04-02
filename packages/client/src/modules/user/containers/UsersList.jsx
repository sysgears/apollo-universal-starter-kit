// React
import React from 'react';
import { graphql, compose } from 'react-apollo';
import { removeTypename } from '../../../../../common/utils';

// Components
import UsersListView from '../components/UsersListView';

// Graphql
import USERS_STATE_QUERY from '../graphql/UsersStateQuery.client.graphql';
import UPDATE_ORDER_BY from '../graphql/UpdateOrderBy.client.graphql';
import USERS_QUERY from '../graphql/UsersQuery.graphql';
import DELETE_USER from '../graphql/DeleteUser.graphql';

class UsersList extends React.Component {
  render() {
    return <UsersListView {...this.props} />;
  }
}

export default compose(
  graphql(USERS_STATE_QUERY, {
    props({ data: { usersState } }) {
      return removeTypename(usersState);
    }
  }),
  graphql(USERS_QUERY, {
    options: ({ orderBy, filter }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: { orderBy, filter }
      };
    },
    props({ data: { loading, users, refetch, error } }) {
      return { loading, users, refetch, errors: error ? error.graphQLErrors : null };
    }
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
  }),
  graphql(UPDATE_ORDER_BY, {
    props: ({ mutate }) => ({
      onOrderBy: orderBy => {
        mutate({ variables: { orderBy } });
      }
    })
  })
)(UsersList);
