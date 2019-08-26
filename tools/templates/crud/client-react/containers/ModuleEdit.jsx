import React from 'react';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';
import { EditView } from '@gqlapp/core-client-react';
import { $Module$Schema } from '@gqlapp/$-module$-server-ts/schema';
import $MODULE$_QUERY from '../graphql/$Module$Query.graphql';
import CREATE_$MODULE$ from '../graphql/Create$Module$.graphql';
import UPDATE_$MODULE$ from '../graphql/Update$Module$.graphql';

class $Module$Edit extends React.Component {
  render() {
    return <EditView {...this.props} schema={$Module$Schema} />;
  }
}

export default compose(
  graphql($MODULE$_QUERY, {
    options: props => {
      const id = Number(props.match ? props.match.params.id : props.navigation.state.params.id);
      return {
        fetchPolicy: 'cache-and-network',
        variables: { where: { id } }
      };
    },
    props({ data: { loading, $module$ } }) {
      return { loading, data: $module$ };
    }
  }),
  graphql(CREATE_$MODULE$, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      createEntry: async data => {
        try {
          const {
            data: { create$Module$ }
          } = await mutate({
            variables: { data }
          });

          if (create$Module$.errors) {
            return { errors: create$Module$.errors };
          }

          if (history) {
            return history.push('/$module$');
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
  graphql(UPDATE_$MODULE$, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      updateEntry: async (data, where) => {
        try {
          const {
            data: { update$Module$ }
          } = await mutate({
            variables: { data, where }
          });

          if (update$Module$.errors) {
            return { errors: update$Module$.errors };
          }

          if (history) {
            return history.push('/$module$');
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
)($Module$Edit);
