import React from 'react';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { ListView } from '../../common/components/crud';
import { $Module$ as $Module$Schema } from '../../../../server/modules/$module$/schema';
import $MODULE$S_QUERY from '../graphql/$Module$sQuery.graphql';
import DELETE_$MODULE$ from '../graphql/Delete$Module$.graphql';
import SORT_$MODULE$S from '../graphql/Sort$Module$s.graphql';
import DELETEMANY_$MODULE$S from '../graphql/DeleteMany$Module$s.graphql';

class $Module$ extends React.Component {
  render() {
    return <ListView {...this.props} schema={$Module$Schema} />;
  }
}

const $Module$WithApollo = compose(
  graphql($MODULE$S_QUERY, {
    options: ({ limit, orderBy, searchText }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          limit: limit,
          orderBy: orderBy,
          filter: { searchText }
        }
      };
    },
    props: ({ data: { loading, $module$s, refetch, error, fetchMore } }) => {
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            offset: $module$s.edges.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.$module$s.edges;
            const pageInfo = fetchMoreResult.$module$s.pageInfo;

            return {
              $module$s: {
                edges: [...previousResult.$module$s.edges, ...newEdges],
                pageInfo,
                __typename: '$Module$s'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, data: $module$s, loadMoreRows, refetch, errors: error ? error.graphQLErrors : null };
    }
  }),
  graphql(DELETE_$MODULE$, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      deleteEntry: async id => {
        try {
          const { data: { delete$Module$ } } = await mutate({
            variables: { where: { id } }
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
          const { data: { sort$Module$s } } = await mutate({
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
      deleteManyEntries: async ids => {
        try {
          const { data: { deleteMany$Module$s } } = await mutate({
            variables: { ids }
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
  })
)($Module$);

export default connect(
  state => ({
    link: state.$module$.link,
    limit: state.$module$.limit,
    searchText: state.$module$.searchText,
    orderBy: state.$module$.orderBy
  }),
  dispatch => ({
    onOrderBy(orderBy) {
      dispatch({
        type: '$MODULE$_ORDER_BY',
        value: orderBy
      });
    }
  })
)($Module$WithApollo);
