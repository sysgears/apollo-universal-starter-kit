// React
import React from 'react';
import { connect } from 'react-redux';

// Components
import UsersFilterView from '../components/UsersFilterView';

class UsersFilter extends React.Component {
  render() {
    return <UsersFilterView {...this.props} />;
  }
}

export default connect(
  state => ({
    searchText: state.users.searchText,
    role: state.users.role,
    isActive: state.users.isActive
  }),
  dispatch => ({
    onSearchTextChange(searchText) {
      dispatch({
        type: 'USER_FILTER_SEARCH_TEXT',
        value: searchText
      });
    },
    onRoleChange(role) {
      dispatch({
        type: 'USER_FILTER_ROLE',
        value: role
      });
    },
    onIsActiveChange(isActive) {
      dispatch({
        type: 'USER_FILTER_IS_ACTIVE',
        value: isActive
      });
    }
  })
)(UsersFilter);
