import React from 'react';
import { graphql, compose } from 'react-apollo';

import GroupEditView from '../components/GroupEditView';

import GROUP_QUERY from '../graphql/GroupQuery.graphql';
import ADD_GROUP from '../graphql/AddGroup.graphql';
import EDIT_GROUP from '../graphql/EditGroup.graphql';

class GroupEdit extends React.Component {
  render() {
    return <GroupEditView {...this.props} />;
  }
}

export default compose(
  graphql(GROUP_QUERY, {
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
    props({ data: { loading, group } }) {
      return { loading, group };
    }
  }),
  graphql(ADD_GROUP, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      addGroup: async input => {
        try {
          const { data: { addGroup } } = await mutate({
            variables: { input }
          });

          if (addGroup.errors) {
            return { errors: addGroup.errors };
          }

          if (history) {
            return history.push('/groups');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(EDIT_GROUP, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      editGroup: async input => {
        try {
          const { data: { editGroup } } = await mutate({
            variables: { input }
          });

          if (editGroup.errors) {
            return { errors: editGroup.errors };
          }

          if (history) {
            return history.push('/groups');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(GroupEdit);
