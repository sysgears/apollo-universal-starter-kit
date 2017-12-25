import React from 'react';
import { graphql, compose } from 'react-apollo';

import UserView from '../components/UserView';

import USER_QUERY from '../graphql/UserQuery.graphql';

class UserViewContainer extends React.Component {
  render() {
    return <UserView {...this.props} />;
  }
}

export default compose(
  graphql(USER_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id }
      };
    },
    props({ data: { loading, user } }) {
      return { loading, user };
    }
  })
)(UserViewContainer);
