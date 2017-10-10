// Web only component
// React
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash';

class UsersFilterView extends React.Component {
  state = {
    searchText: this.props.searchText
  };

  doSearch = debounce(() => {
    const { onSearchTextChange } = this.props;
    onSearchTextChange(this.state.searchText);
  }, 300);

  handleSearch = event => {
    this.setState({ searchText: event.target.value }, () => {
      this.doSearch();
    });
  };

  handleIsAdmin = () => {
    const { onIsAdminChange, isAdmin } = this.props;
    onIsAdminChange(!isAdmin);
  };

  render() {
    const { isAdmin } = this.props;
    return (
      <form className="form-inline">
        <label className="mr-sm-2">Filter: </label>
        <input
          type="text"
          className="form-control mb-2 mr-sm-2 mb-sm-0"
          value={this.state.searchText}
          onChange={this.handleSearch}
          placeholder="Search"
        />

        <div className="form-check mb-2 mr-sm-2 mb-sm-0">
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="checkbox"
              defaultChecked={isAdmin}
              onChange={this.handleIsAdmin}
            />{' '}
            Is Admin
          </label>
        </div>
      </form>
    );
  }
}

UsersFilterView.propTypes = {
  searchText: PropTypes.string,
  isAdmin: PropTypes.bool,
  onSearchTextChange: PropTypes.func.isRequired,
  onIsAdminChange: PropTypes.func.isRequired
};

export default UsersFilterView;
