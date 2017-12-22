// React
import React from 'react';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import GroupMembersListView from '../components/GroupMembersListView';

// Queries
import GROUP_MEMBERS_QUERY from '../graphql/GroupMembersQuery.graphql';

class GroupMembersList extends React.Component {
  render() {
    return <GroupMembersListView {...this.props} />;
  }
}

const GroupMembersListWithApollo = compose(
  graphql(GROUP_MEMBERS_QUERY, {
    options: props => {
      let { id, orderBy, searchText, role, isActive } = props;

      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          id: id ? id : 0,
          orderBy: orderBy,
          filter: { searchText, role, isActive }
        }
      };
    },
    props({ data: { loading, groupMembers, refetch, error } }) {
      return { loading, groupMembers, refetch, errors: error ? error.graphQLErrors : null };
    }
  })
)(GroupMembersList);

export default connect(
  state => ({
    // id: state.location.params.groupId,
    searchText: state.groupMembers.searchText,
    role: state.groupMembers.role,
    isActive: state.groupMembers.isActive,
    orderBy: state.groupMembers.orderBy
  }),
  dispatch => ({
    onOrderBy(orderBy) {
      dispatch({
        type: 'GROUP_MEMBER__ORDER_BY',
        value: orderBy
      });
    }
  })
)(GroupMembersListWithApollo);
