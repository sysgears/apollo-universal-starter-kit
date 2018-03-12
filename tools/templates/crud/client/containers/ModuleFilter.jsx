import React from 'react';
import { graphql, compose } from 'react-apollo';

import { removeTypename } from '../../../../../common/utils';
import { FilterView } from '../../common/components/crud';
import { $Module$Schema } from '../../../../../server/src/modules/$module$/schema';

import $MODULE$_STATE_QUERY from '../graphql/$Module$StateQuery.client.graphql';
import UPDATE_FILTER from '../graphql/UpdateFilter.client.graphql';

class $Module$Filter extends React.Component {
  render() {
    return <FilterView {...this.props} schema={$Module$Schema} />;
  }
}

export default compose(
  graphql($MODULE$_STATE_QUERY, {
    props({ data: { $module$State: { filter } } }) {
      return removeTypename(filter);
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
