// React
import React from 'react';
import { connect } from 'react-redux';

// Components
import GroupMembersFilterView from '../components/GroupMembersFilterView';

class GroupMembersFilter extends React.Component {
  render() {
    return <GroupMembersFilterView {...this.props} />;
  }
}

export default connect(
  state => ({
    searchText: state.groupMembers.searchText,
    role: state.groupMembers.role,
    isActive: state.groupMembers.isActive
  }),
  dispatch => ({
    onSearchTextChange(searchText) {
      dispatch({
        type: 'GROUP_MEMBER_FILTER_SEARCH_TEXT',
        value: searchText
      });
    },
    onRoleChange(role) {
      dispatch({
        type: 'GROUP_MEMBER_FILTER_ROLE',
        value: role
      });
    },
    onIsActiveChange(isActive) {
      dispatch({
        type: 'GROUP_MEMBER_FILTER_IS_ACTIVE',
        value: isActive
      });
    }
  })
)(GroupMembersFilter);
