// React
import React from 'react';
import { connect } from 'react-redux';

// Components
import GroupsFilterView from '../components/GroupsFilterView';

class GroupsFilter extends React.Component {
  render() {
    return <GroupsFilterView {...this.props} />;
  }
}

export default connect(
  state => ({
    searchText: state.groups.searchText,
    role: state.groups.role,
    isActive: state.groups.isActive
  }),
  dispatch => ({
    onSearchTextChange(searchText) {
      dispatch({
        type: 'GROUP_FILTER_SEARCH_TEXT',
        value: searchText
      });
    },
    onRoleChange(role) {
      dispatch({
        type: 'GROUP_FILTER_ROLE',
        value: role
      });
    },
    onIsActiveChange(isActive) {
      dispatch({
        type: 'GROUP_FILTER_IS_ACTIVE',
        value: isActive
      });
    }
  })
)(GroupsFilter);
