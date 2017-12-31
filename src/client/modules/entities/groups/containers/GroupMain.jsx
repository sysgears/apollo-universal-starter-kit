import React from 'react';
import { graphql, compose } from 'react-apollo';

import GroupMainView from '../components/GroupMainView';

import GROUP_QUERY from '../graphql/GroupQuery.graphql';

class GroupMain extends React.Component {
  render() {
    return <GroupMainView {...this.props} />;
  }
}

export default compose(
  graphql(GROUP_QUERY, {
    options: props => {
      let id = 'none';
      if (props.match) {
        id = props.match.params.groupId;
      } else if (props.navigation) {
        id = props.navigation.state.params.groupId;
      }

      console.log('Group Query ID', id);

      return {
        variables: { id }
      };
    },
    props({ data: { loading, group } }) {
      return { loading, group };
    }
  })
)(GroupMain);
