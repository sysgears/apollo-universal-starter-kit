import { graphql } from 'react-apollo';
import { removeTypename } from '../../../../../common/utils';

import USERS_STATE_QUERY from '../graphql/UsersStateQuery.client.graphql';
import UPDATE_ORDER_BY from '../graphql/UpdateOrderBy.client.graphql';
import USERS_QUERY from '../graphql/UsersQuery.graphql';
import DELETE_USER from '../graphql/DeleteUser.graphql';
import UPDATE_FILTER from '../graphql/UpdateFilter.client.graphql';

const withUsersState = Component =>
  graphql(USERS_STATE_QUERY, {
    props({ data: { usersState } }) {
      return removeTypename(usersState);
    }
  })(Component);

const whitUsers = Component =>
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
  })(Component);

const withUsersDeleting = Component =>
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
  })(Component);

const withOrderByUpdating = Component =>
  graphql(UPDATE_ORDER_BY, {
    props: ({ mutate }) => ({
      onOrderBy: orderBy => {
        mutate({ variables: { orderBy } });
      }
    })
  })(Component);

const withFilterUpdating = Component =>
  graphql(UPDATE_FILTER, {
    props: ({ mutate }) => ({
      onSearchTextChange(searchText) {
        mutate({ variables: { filter: { searchText } } });
      },
      onRoleChange(role) {
        mutate({ variables: { filter: { role } } });
      },
      onIsActiveChange(isActive) {
        mutate({ variables: { filter: { isActive } } });
      }
    })
  })(Component);

export { withUsersState, whitUsers, withUsersDeleting, withOrderByUpdating, withFilterUpdating };
