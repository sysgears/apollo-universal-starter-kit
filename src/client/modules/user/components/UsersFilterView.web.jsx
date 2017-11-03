import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';
import { Form, FormItem, Select, Option, Label, Input } from '../../common/components/web';

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
      <Form layout="inline">
        <FormItem label="Filter">
          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            placeholder="Search ..."
            element={Input}
            onChange={this.handleSearch}
          />
        </FormItem>
        &nbsp;
        <FormItem label="Role">
          <Select name="role" defaultValue={role} onChange={this.handleRole}>
            <Option key={1} value="">
              Select ...
            </Option>
            <Option key={2} value="user">
              user
            </Option>
            <Option key={3} value="admin">
              admin
            </Option>
          </Select>
        </FormItem>
        &nbsp;
        <FormItem>
          <Label>
            <Input type="checkbox" defaultChecked={isActive} onChange={this.handleIsActive} /> Is Active
          </Label>
        </FormItem>
      </Form>
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
