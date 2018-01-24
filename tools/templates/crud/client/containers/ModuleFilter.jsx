import React from 'react';
import { connect } from 'react-redux';

import { FilterView } from '../../common/components/crud';

class $Module$Filter extends React.PureComponent {
  render() {
    return <FilterView {...this.props} />;
  }
}

export default connect(
  state => ({
    searchText: state.$module$.searchText
  }),
  dispatch => ({
    onSearchTextChange(searchText) {
      dispatch({
        type: '$MODULE$_FILTER_SEARCH_TEXT',
        value: searchText
      });
    }
  })
)($Module$Filter);
