import React from 'react';
import { graphql, compose } from 'react-apollo';

import { removeTypename } from '../../../../../common/utils';
import { FilterView } from '../../common/components/crud';

import $MODULE$_STATE_QUERY from '../graphql/$Module$StateQuery.client.graphql';
import UPDATE_FILTER from '../graphql/UpdateFilter.client.graphql';

class $Module$Filter extends React.PureComponent {
  render() {
    return <FilterView {...this.props} />;
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
      onSearchTextChange(searchText) {
        mutate({ variables: { filter: { searchText } } });
      }
    })
  })
)($Module$Filter);
