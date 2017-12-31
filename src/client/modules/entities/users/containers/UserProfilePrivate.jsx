/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import UserProfilePrivateView from '../components/UserProfilePrivateView';

import QUERY from '../graphql/Query-UserProfilePrivate.graphql';

class UserProfilePrivateContainer extends React.Component {
  render() {
    return <UserProfilePrivateView {...this.props} />;
  }
}

export default compose(
  graphql(QUERY, {
    options: props => {
      let id = '';
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id }
      };
    },
    props({ data }) {
      console.log('Query-UserProfile - Private');
      const { loading, user, errors } = data;
      return { loading, user, errors };
    }
  })
)(UserProfilePrivateContainer);
