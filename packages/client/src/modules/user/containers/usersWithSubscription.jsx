import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

import {
  subscribeToUsersList,
  withFilterUpdating,
  withOrderByUpdating,
  withUsers,
  withUsersDeleting,
  withUsersState
} from './UserOperations';

export default Component => {
  return compose(
    withUsersState,
    withUsers,
    withUsersDeleting,
    withOrderByUpdating,
    withFilterUpdating
  )(
    class UsersWithSubscription extends React.Component {
      static propTypes = {
        filter: PropTypes.object,
        subscribeToMore: PropTypes.func,
        loading: PropTypes.bool
      };

      constructor(props) {
        super(props);
        this.subscription = null;
        this.currentFilter = null;
      }

      componentDidMount() {
        this.checkSubscription();
      }

      componentDidUpdate() {
        this.checkSubscription();
      }

      componentWillUnmount() {
        if (this.subscription) {
          this.subscription();
        }
      }

      checkSubscription() {
        const { loading, subscribeToMore, filter } = this.props;

        if (!loading) {
          // The component must re-subscribe every time filters changed.
          // That allows to get valid data after some CRUD operation happens.
          if (JSON.stringify(this.currentFilter) !== JSON.stringify(filter)) {
            this.currentFilter = filter;

            if (this.subscription) {
              this.subscription();
              this.subscription = null;
            }

            this.subscription = subscribeToUsersList(subscribeToMore, filter);
          } else if (!this.subscription) {
            this.subscription = subscribeToUsersList(subscribeToMore, filter);
          }
        }
      }

      render() {
        return <Component {...this.props} />;
      }
    }
  );
};
