import React from 'react';
import { connect } from 'react-redux';

import { FilterView } from '../../common/components/crud';

class CustomerFilter extends React.PureComponent {
  render() {
    return <FilterView {...this.props} />;
  }
}

export default connect(
  state => ({
    searchText: state.customer.searchText
  }),
  dispatch => ({
    onSearchTextChange(searchText) {
      dispatch({
        type: 'CUSTOMER_FILTER_SEARCH_TEXT',
        value: searchText
      });
    }
  })
)(CustomerFilter);
