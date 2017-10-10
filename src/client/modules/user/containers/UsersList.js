/*eslint-disable no-unused-vars*/
// React
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import UsersListView from '../components/UsersListView';

import USERS_QUERY from '../graphql/UsersQuery.graphql';

class UsersList extends React.Component {
  render() {
    return <UsersListView {...this.props} />;
  }
}

UsersList.propTypes = {
  loading: PropTypes.bool.isRequired,
  users: PropTypes.array,
  errors: PropTypes.array
};

const UsersListWithApollo = compose(
  graphql(USERS_QUERY, {
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          orderBy: props.orderBy,
          filter: { searchText: props.searchText, isAdmin: props.isAdmin }
        }
      };
    },
    props({ data: { loading, users, error } }) {
      return { loading, users, errors: error ? error.graphQLErrors : null };
    }
  })
)(UsersList);

export default connect(
  state => ({
    searchText: state.user.searchText,
    isAdmin: state.user.isAdmin,
    orderBy: state.user.orderBy
  }),
  dispatch => ({
    onOrderBy(orderBy) {
      dispatch({
        type: 'USER_ORDER_BY',
        value: orderBy
      });
    }
  })
)(UsersListWithApollo);
