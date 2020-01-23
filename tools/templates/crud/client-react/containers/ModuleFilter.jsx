import React from 'react';
import { graphql } from 'react-apollo';
import { FilterView } from '@gqlapp/core-client-react';
import { compose, removeTypename } from '@gqlapp/core-common';

import { $Module$Schema } from '@gqlapp/$-module$-server-ts/schema';

import $MODULE$_STATE_QUERY from '../graphql/$Module$StateQuery.client.graphql';
import UPDATE_FILTER from '../graphql/UpdateFilter.client.graphql';

class $Module$Filter extends React.Component {
  render() {
    return <FilterView {...this.props} schema={$Module$Schema} />;
  }
}

export default compose(
  graphql($MODULE$_STATE_QUERY, {
    props({ data: { loading, $module$State } }) {
      if (loading === false) {
        return removeTypename($module$State.filter);
      }
    }
  }),
  graphql(UPDATE_FILTER, {
    props: ({ mutate }) => ({
      onFilterChange(filter) {
        mutate({ variables: { filter } });
      }
    })
  })
)($Module$Filter);
