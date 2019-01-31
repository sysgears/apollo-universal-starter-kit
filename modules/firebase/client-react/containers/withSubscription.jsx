import React from 'react';
import PropTypes from 'prop-types';
import { Subscription } from 'react-apollo';

import USERS_SUBSCRIPTION from '../graphql/UsersSubscription.graphql';

export default Component => {
  return class UsersWithSubscription extends React.Component {
    static propTypes = {
      filter: PropTypes.object
    };

    render() {
      const { filter } = this.props;

      return (
        <Subscription subscription={USERS_SUBSCRIPTION} variables={{ filter }}>
          {({ data, loading }) => {
            if (!loading && data.usersUpdated) {
              return <Component {...this.props} usersUpdated={data.usersUpdated} />;
            }

            return <Component {...this.props} />;
          }}
        </Subscription>
      );
    }
  };
};
