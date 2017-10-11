// Web only component
// React
import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';

class UsersFilterView extends React.PureComponent {
  handleSearch = e => {
    const { onSearchTextChange } = this.props;
    onSearchTextChange(e.target.value);
  };

  handleIsAdmin = () => {
    const { onIsAdminChange, isAdmin } = this.props;
    onIsAdminChange(!isAdmin);
  };

  handleIsActive = () => {
    const { onIsActiveChange, isActive } = this.props;
    onIsActiveChange(!isActive);
  };

  render() {
    const { isAdmin, isActive } = this.props;
    return (
      <form className="form-inline">
        <label className="mr-sm-2">Filter: </label>
        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          className="form-control mb-2 mr-sm-2 mb-sm-0"
          onChange={this.handleSearch}
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

        <div className="form-check mb-2 mr-sm-2 mb-sm-0">
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="checkbox"
              defaultChecked={isActive}
              onChange={this.handleIsActive}
            />{' '}
            Is Active
          </label>
        </div>
      </form>
    );
  }
}

UsersFilterView.propTypes = {
  searchText: PropTypes.string,
  isAdmin: PropTypes.bool,
  isActive: PropTypes.bool,
  onSearchTextChange: PropTypes.func.isRequired,
  onIsAdminChange: PropTypes.func.isRequired,
  onIsActiveChange: PropTypes.func.isRequired
};

export default UsersFilterView;
