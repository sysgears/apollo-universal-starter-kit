import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';

import translate from '../../../i18n';
import { Form, FormItem, Select, Option, Label, Input } from '../../common/components/web';

class UsersFilterView extends React.PureComponent {
  static propTypes = {
    searchText: PropTypes.string,
    filter: PropTypes.object,
    role: PropTypes.string,
    isActive: PropTypes.bool,
    onSearchTextChange: PropTypes.func.isRequired,
    onRoleChange: PropTypes.func.isRequired,
    onIsActiveChange: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  handleSearch = e => {
    const { onSearchTextChange } = this.props;
    onSearchTextChange(e.target.value);
  };

  handleRole = e => {
    const { onRoleChange } = this.props;
    onRoleChange(e.target.value);
  };

  handleIsActive = () => {
    const {
      onIsActiveChange,
      filter: { isActive }
    } = this.props;
    onIsActiveChange(!isActive);
  };

  render() {
    const {
      filter: { role, isActive },
      t
    } = this.props;
    return (
      <Form layout="inline">
        <FormItem label={t('users.list.item.filter')}>
          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            placeholder={t('users.list.item.search')}
            element={Input}
            onChange={this.handleSearch}
          />
        </FormItem>
        &nbsp;
        <FormItem label={t('users.list.item.role.label')}>
          <Select name="role" defaultValue={role} onChange={this.handleRole}>
            <Option key={1} value="">
              {t('users.list.item.role.all')}
            </Option>
            <Option key={2} value="user">
              {t('users.list.item.role.user')}
            </Option>
            <Option key={3} value="admin">
              {t('users.list.item.role.admin')}
            </Option>
          </Select>
        </FormItem>
        &nbsp;
        <FormItem>
          <Label>
            <Input type="checkbox" defaultChecked={isActive} onChange={this.handleIsActive} />
            {t('users.list.item.active')}
          </Label>
        </FormItem>
      </Form>
    );
  }
}

export default translate('user')(UsersFilterView);
