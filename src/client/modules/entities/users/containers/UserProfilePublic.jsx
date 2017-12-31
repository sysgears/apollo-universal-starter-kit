/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import UserProfilePublicView from '../components/UserProfilePublicView';

import QUERY from '../graphql/Query-UserProfilePublic.graphql';

class UserProfilePublicContainer extends React.Component {
  render() {
    return <UserProfilePublicView {...this.props} />;
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
    props({ data: { loading, user, errors } }) {
      return { loading, user, errors };
    }
  })
)(UserProfilePublicContainer);
