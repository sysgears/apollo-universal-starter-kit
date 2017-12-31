import React from 'react';
import { graphql, compose } from 'react-apollo';

import GroupSettingsView from '../components/GroupSettingsView';

import ADMIN_QUERY from '../graphql/AdminQuery.graphql';
// import EDIT_GROUP from '../graphql/EditGroup.graphql';

class GroupSettings extends React.Component {
  render() {
    return <GroupSettingsView {...this.props} />;
  }
}

export default compose(
  graphql(ADMIN_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.groupId;
      } else if (props.navigation) {
        id = props.navigation.state.params.groupId;
      }

      return {
        variables: { id }
      };
    },
    props({ data: { loading, groupSettings } }) {
      return { loading, groupSettings };
    }
  })
)(GroupSettings);
