/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import GroupMembersMainView from '../components/GroupMembersMainView';

import MEMBERS_QUERY from '../graphql/MembersQuery.graphql';
import MEMBER_ADD from '../graphql/MemberAdd.graphql';
import MEMBER_RMV from '../graphql/MemberRemove.graphql';

class GroupMembers extends React.Component {
  render() {
    return <GroupMembersMainView {...this.props} />;
  }
}

const GroupMembersWithApollo = compose(
  graphql(MEMBERS_QUERY, {
    options: props => {
      console.log('Members Query - props', props);
      let { group, orderBy, searchText, role, isActive } = props;

      let id = group.id;

      console.log('Members Query - id', id);

      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          id: id ? id : 'none',
          orderBy: orderBy,
          filter: { searchText, role, isActive }
        }
      };
    },
    props({ data }) {
      console.log('MembersQuery - response', data);
      let { loading, groupMembers, refetch, error } = data;
      return { loading, groupMembers, refetch, errors: error ? error.graphQLErrors : null };
    }
  }),

  graphql(MEMBER_ADD, {
    props: ({ mutate }) => ({
      addGroupMember: async input => {
        try {
          const { data: { addGroupMember } } = await mutate({
            variables: { input }
          });

          if (addGroupMember.errors) {
            return { errors: addGroupMember.errors };
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),

  graphql(MEMBER_RMV, {
    props: ({ mutate }) => ({
      removeGroupMember: async input => {
        try {
          const { data: { removeGroupMember } } = await mutate({
            variables: { input }
          });

          if (removeGroupMember.errors) {
            return { errors: removeGroupMember.errors };
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(GroupMembers);

export default GroupMembersWithApollo;
