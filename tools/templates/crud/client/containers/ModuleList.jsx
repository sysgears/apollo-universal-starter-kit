import React from 'react';
import { graphql, compose } from 'react-apollo';

import $Module$ListView from '../components/$Module$ListView';
import $MODULE$S_QUERY from '../graphql/$Module$sQuery.graphql';

class $Module$ extends React.Component {
  render() {
    return <$Module$ListView {...this.props} />;
  }
}

const $Module$WithApollo = compose(
  graphql($MODULE$S_QUERY, {
    options: () => {
      return {
        fetchPolicy: 'cache-and-network'
      };
    },
    props({ data: { loading, $module$s, refetch, error } }) {
      return { loading, $module$s, refetch, errors: error ? error.graphQLErrors : null };
    }
  }),
)($Module$);

export default $Module$WithApollo;
