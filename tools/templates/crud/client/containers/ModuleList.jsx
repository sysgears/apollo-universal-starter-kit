import React from 'react';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import { removeTypename, removeEmpty } from '../../../../../common/utils';
import { ListView } from '../../common/components/crud';
import { updateEntry, deleteEntry } from '../../common/crud';
import { $Module$Schema } from '../../../../../server/src/modules/$module$/schema';

import $MODULE$_STATE_QUERY from '../graphql/$Module$StateQuery.client.graphql';
import UPDATE_ORDER_BY from '../graphql/UpdateOrderBy.client.graphql';
import $MODULE$S_QUERY from '../graphql/$Module$sQuery.graphql';
import UPDATE_$MODULE$ from '../graphql/Update$Module$.graphql';
import DELETE_$MODULE$ from '../graphql/Delete$Module$.graphql';
import SORT_$MODULE$S from '../graphql/Sort$Module$s.graphql';
import DELETEMANY_$MODULE$S from '../graphql/DeleteMany$Module$s.graphql';
import UPDATEMANY_$MODULE$S from '../graphql/UpdateMany$Module$s.graphql';
import $MODULE$S_SUBSCRIPTION from '../graphql/$Module$sSubscription.graphql';

function Add$Module$(prev, node) {
  return update(prev, {
    $module$sConnection: {
      totalCount: {
        $set: prev.$module$sConnection.totalCount + 1
      },
      edges: {
        $set: [...prev.$module$sConnection.edges, node]
      }
    }
  });
}

class $Module$ extends React.Component {
  static propTypes = {
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    this.init$Module$ListSubscription();
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  init$Module$ListSubscription() {
    if (!this.subscription) {
      this.subscribeTo$Module$sList();
    }
  }

  subscribeTo$Module$sList = () => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: $MODULE$S_SUBSCRIPTION,
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              $module$sUpdated: { mutation, node }
            }
          }
        }
      ) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = Add$Module$(prev, node);
        }
        return newResult;
      }
    });
  };
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
    props: ({ data: { loading, $module$sConnection, refetch, error, fetchMore, subscribeToMore } }) => {
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
                __typename: '$Module$Connection'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return {
        loading,
        data: $module$sConnection,
        loadMoreRows,
        refetch,
        subscribeToMore,
        errors: error ? error.graphQLErrors : null
      };
    }
  }),
  graphql(UPDATE_$MODULE$, {
    props: props => ({
      updateEntry: args => updateEntry(props, args, 'update$Module$')
    })
  }),
  graphql(DELETE_$MODULE$, {
    props: props => ({
      deleteEntry: args => deleteEntry(props, args, 'delete$Module$')
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
