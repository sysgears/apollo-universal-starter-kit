import React from 'react';
import { graphql, compose } from 'react-apollo';

import { removeTypename } from '../../../../../common/utils';
import { FilterView } from '../../common/components/crud';

import TESTMODULE_STATE_QUERY from '../graphql/TestModuleStateQuery.client.graphql';
import UPDATE_FILTER from '../graphql/UpdateFilter.client.graphql';

class TestModuleFilter extends React.PureComponent {
  render() {
    return <FilterView {...this.props} />;
  }
}

export default compose(
  graphql(TESTMODULE_STATE_QUERY, {
    props({ data: { testModuleState: { filter } } }) {
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
)(TestModuleFilter);
