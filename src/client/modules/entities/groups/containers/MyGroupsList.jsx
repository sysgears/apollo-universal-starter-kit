// React
import React from 'react';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import GroupsListView from '../components/GroupsListView';

import MY_GROUPS_QUERY from '../graphql/MyGroupsQuery.graphql';
import DELETE_GROUP from '../graphql/DeleteGroup.graphql';

class GroupsList extends React.Component {
  render() {
    return <GroupsListView {...this.props} />;
  }
}

const GroupsListWithApollo = compose(
  graphql(MY_GROUPS_QUERY, {
    options: ({ orderBy, searchText, role, isActive }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          orderBy: orderBy,
          filter: { searchText, role, isActive }
        }
      };
    },
    props({ data }) {
      console.log('MyGroups - data', data);
      const { loading, myGroups, refetch, error } = data;
      console.log('MyGroups', loading, myGroups, error);
      // check
      return {
        loading,
        groups: myGroups ? myGroups.groups : null,
        refetch,
        errors: error ? error.graphQLErrors : null
      };
    }
  }),
  graphql(DELETE_GROUP, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteGroup: async id => {
        try {
          const { data: { deleteGroup } } = await mutate({
            variables: { id }
          });

          // refetch GROUPS_QUERY
          refetch();

          if (deleteGroup.errors) {
            return { errors: deleteGroup.errors };
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(GroupsList);

export default connect(
  state => ({
    searchText: state.groups.searchText,
    role: state.groups.role,
    isActive: state.groups.isActive,
    orderBy: state.groups.orderBy
  }),
  dispatch => ({
    onOrderBy(orderBy) {
      dispatch({
        type: 'GROUP_ORDER_BY',
        value: orderBy
      });
    }
  })
)(GroupsListWithApollo);
