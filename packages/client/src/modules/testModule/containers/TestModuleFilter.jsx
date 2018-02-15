import React from 'react';
import { connect } from 'react-redux';

import { FilterView } from '../../common/components/crud';

class TestModuleFilter extends React.PureComponent {
  render() {
    return <FilterView {...this.props} />;
  }
}

export default connect(
  state => ({
    searchText: state.testModule.searchText
  }),
  dispatch => ({
    onSearchTextChange(searchText) {
      dispatch({
        type: 'TESTMODULE_FILTER_SEARCH_TEXT',
        value: searchText
      });
    }
  })
)(TestModuleFilter);
