// React
import React from 'react';
import { compose } from 'react-apollo';

// Components
import UsersFilterView from '../components/UsersFilterView';

import { withUsersState, withFilterUpdating } from './UserOperations';

class UsersFilter extends React.Component {
  render() {
    return <UsersFilterView {...this.props} />;
  }
}

export default compose(withUsersState, withFilterUpdating)(UsersFilter);
