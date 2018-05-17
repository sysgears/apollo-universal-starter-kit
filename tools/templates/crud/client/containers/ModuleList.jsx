import React from 'react';
import { graphql, compose } from 'react-apollo';

import { removeTypename, removeEmpty } from '../../../../../common/utils';
import { ListView } from '../../common/components/crud';
import { $Module$Schema } from '../../../../../server/src/modules/$module$/schema';

import $MODULE$_STATE_QUERY from '../graphql/$Module$StateQuery.client.graphql';
import UPDATE_ORDER_BY from '../graphql/UpdateOrderBy.client.graphql';
import $MODULE$S_QUERY from '../graphql/$Module$sQuery.graphql';
import UPDATE_$MODULE$ from '../graphql/Update$Module$.graphql';
import DELETE_$MODULE$ from '../graphql/Delete$Module$.graphql';
import SORT_$MODULE$S from '../graphql/Sort$Module$s.graphql';
import DELETEMANY_$MODULE$S from '../graphql/DeleteMany$Module$s.graphql';
import UPDATEMANY_$MODULE$S from '../graphql/UpdateMany$Module$s.graphql';

class $Module$ extends React.Component {
  render() {
    return <ListView {...this.props} schema={$Module$Schema} />;
  }
}

export default compose(
  graphql($MODULE$_STATE_QUERY, {
    props({ data: { $module$State } }) {
      return removeTypename($module$State);
    }
  }),
  graphql($MODULE$S_QUERY, {
    options: ({ limit, orderBy, filter }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: { limit, orderBy, filter: removeEmpty(filter) }
      };
    },
    props: ({ data: { loading, $module$sConnection, refetch, error, fetchMore } }) => {
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            offset: $module$sConnection.edges.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.$module$sConnection.edges;
            const pageInfo = fetchMoreResult.$module$sConnection.pageInfo;

            return {
              $module$sConnection: {
                edges: [...previousResult.$module$sConnection.edges, ...newEdges],
                pageInfo,
                __typename: '$Module$sConnection'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, data: $module$sConnection, loadMoreRows, refetch, errors: error ? error.graphQLErrors : null };
    }
  }),
  graphql(UPDATE_$MODULE$, {
    props: ({ ownProps: { refetch }, mutate }) => ({
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

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(DELETE_$MODULE$, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteEntry: async where => {
        try {
          const {
            data: { delete$Module$ }
          } = await mutate({
            variables: { where }
          });

          if (delete$Module$.errors) {
            return { errors: delete$Module$.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(SORT_$MODULE$S, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      sortEntries: async data => {
        try {
          const {
            data: { sort$Module$s }
          } = await mutate({
            variables: { data }
          });

          if (sort$Module$s.errors) {
            return { errors: sort$Module$s.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(DELETEMANY_$MODULE$S, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteManyEntries: async where => {
        try {
          const {
            data: { deleteMany$Module$s }
          } = await mutate({
            variables: { where }
          });

          if (deleteMany$Module$s.errors) {
            return { errors: deleteMany$Module$s.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(UPDATEMANY_$MODULE$S, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      updateManyEntries: async (data, where) => {
        try {
          const {
            data: { updateMany$Module$s }
          } = await mutate({
            variables: { data: removeEmpty(data), where }
          });

          if (updateMany$Module$s.errors) {
            return { errors: updateMany$Module$s.errors };
          }

          refetch();
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(UPDATE_ORDER_BY, {
    props: ({ mutate }) => ({
      onOrderBy: orderBy => {
        mutate({ variables: { orderBy } });
      }
    })
  })
)($Module$);
