/*eslint-disable no-unused-vars*/
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
    searchText: state.user.searchText,
    isAdmin: state.user.isAdmin,
    isActive: state.user.isActive
  }),
  dispatch => ({
    onSearchTextChange(searchText) {
      dispatch({
        type: 'USER_FILTER_SEARCH_TEXT',
        value: searchText
      });
    },
    onIsAdminChange(isAdmin) {
      dispatch({
        type: 'USER_FILTER_IS_ADMIN',
        value: isAdmin
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
