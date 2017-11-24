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
    options: ({ orderBy, searchText }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          orderBy: orderBy,
          filter: { searchText }
        }
      };
    },
    props({ data: { loading, $module$s, refetch, error } }) {
      return { loading, $module$s, refetch, errors: error ? error.graphQLErrors : null };
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
