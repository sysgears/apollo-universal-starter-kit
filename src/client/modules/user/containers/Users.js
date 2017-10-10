/*eslint-disable no-unused-vars*/
// React
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import UsersView from '../components/UsersView';

import USERS_QUERY from '../graphql/UsersQuery.graphql';

class Users extends React.Component {
  render() {
    return <UsersView {...this.props} />;
  }
}

Users.propTypes = {
  loading: PropTypes.bool.isRequired,
  users: PropTypes.array,
  errors: PropTypes.array
};

const UserWithApollo = compose(
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
)(Users);

export default connect(
  state => ({
    searchText: state.user.searchText,
    isAdmin: state.user.isAdmin,
    orderBy: state.user.orderBy
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
    onOrderBy(orderBy) {
      dispatch({
        type: 'USER_ORDER_BY',
        value: orderBy
      });
    }
  })
)(UserWithApollo);
