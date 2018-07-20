// React
import React from 'react';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';

// Components
import UsersFilterView from '../components/UsersFilterView';

import { withUsersState, withFilterUpdating } from './UserOperations';

class UsersFilter extends React.Component {
  static propTypes = {
    filter: PropTypes.object,
    role: PropTypes.string,
    isActive: PropTypes.bool,
    onSearchTextChange: PropTypes.func.isRequired,
    onRoleChange: PropTypes.func.isRequired,
    onIsActiveChange: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  handleSearch = searchText => {
    const { onSearchTextChange } = this.props;
    onSearchTextChange(searchText);
  };

  handleRole = role => {
    const { onRoleChange } = this.props;
    onRoleChange(role);
  };

  handleIsActive = () => {
    const {
      onIsActiveChange,
      filter: { isActive }
    } = this.props;
    onIsActiveChange(!isActive);
  };

  render() {
    const filterProps = {
      ...this.props,
      handleSearch: this.handleSearch,
      handleRole: this.handleRole,
      handleIsActive: this.handleIsActive
    };

    return <UsersFilterView {...filterProps} />;
  }
}

export default compose(
  withUsersState,
  withFilterUpdating
)(UsersFilter);
