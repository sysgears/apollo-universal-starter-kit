import React from 'react';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import $Module$ListView from '../components/$Module$ListView';
import $MODULE$S_QUERY from '../graphql/$Module$sQuery.graphql';
import DELETE_$MODULE$ from '../graphql/Delete$Module$.graphql';

class $Module$ extends React.Component {
  render() {
    return <$Module$ListView {...this.props} />;
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
    props: ({ ownProps: { limit }, data: { loading, $module$s, refetch, error, fetchMore } }) => {
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            offset: $module$s.edges.length + limit
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
      return { loading, $module$s, loadMoreRows, refetch, errors: error ? error.graphQLErrors : null };
    }
  }),
  graphql(DELETE_$MODULE$, {
    props: ({ ownProps: { refetch }, mutate }) => ({
      delete$Module$: async id => {
        try {
          const { data: { delete$Module$ } } = await mutate({
            variables: { id }
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
  })
)($Module$);

export default connect(
  state => ({
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
