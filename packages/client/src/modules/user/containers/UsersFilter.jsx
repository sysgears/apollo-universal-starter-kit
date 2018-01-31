// React
import React from 'react';
import { graphql, compose } from 'react-apollo';
import { removeTypename } from '../../../../../common/utils';

// Components
import UsersFilterView from '../components/UsersFilterView';

//Graphql
import USERS_STATE_QUERY from '../graphql/UsersStateQuery.client.graphql';
import UPDATE_FILTER from '../graphql/UpdateFilter.client.graphql';

class UsersFilter extends React.Component {
  render() {
    return <UsersFilterView {...this.props} />;
  }
}

export default compose(
  graphql(USERS_STATE_QUERY, {
    props({ data: { usersState: { filter } } }) {
      return removeTypename(filter);
    }
  }),
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
  })
)(UsersFilter);
