import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';
import { Select, Option } from '../../common/components/web';

class UsersFilterView extends React.PureComponent {
  handleSearch = e => {
    const { onSearchTextChange } = this.props;
    onSearchTextChange(e.target.value);
  };

  handleRole = e => {
    const { onRoleChange } = this.props;
    onRoleChange(e.target.value);
  };

  handleIsActive = () => {
    const { onIsActiveChange, isActive } = this.props;
    onIsActiveChange(!isActive);
  };

  render() {
    const { role, isActive } = this.props;
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
            Role:
            <Select name="role" defaultValue={role} onChange={this.handleRole}>
              <Option />
              <Option value="user">user</Option>
              <Option value="admin">admin</Option>
            </Select>
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
  role: PropTypes.string,
  isActive: PropTypes.bool,
  onSearchTextChange: PropTypes.func.isRequired,
  onRoleChange: PropTypes.func.isRequired,
  onIsActiveChange: PropTypes.func.isRequired
};

export default UsersFilterView;
