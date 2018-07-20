import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';

import translate from '../../../i18n';
import { Form, FormItem, Select, Option, Label, Input } from '../../common/components/web';

const UsersFilterView = ({ searchText, role, isActive, handleSearch, handleRole, handleIsActive, t }) => (
  <Form layout="inline">
    <FormItem label={t('users.list.item.filter')}>
      <DebounceInput
        minLength={2}
        debounceTimeout={300}
        placeholder={t('users.list.item.search')}
        element={Input}
        value={searchText}
        onChange={e => handleSearch(e.target.value)}
      />
    </FormItem>
    &nbsp;
    <FormItem label={t('users.list.item.role.label')}>
      <Select name="role" defaultValue={role} onChange={e => handleRole(e.target.value)}>
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
        <Input type="checkbox" defaultChecked={isActive} onChange={handleIsActive} />
        {t('users.list.item.active')}
      </Label>
    </FormItem>
  </Form>
);

UsersFilterView.propTypes = {
  searchText: PropTypes.string,
  role: PropTypes.string,
  isActive: PropTypes.bool,
  handleSearch: PropTypes.func.isRequired,
  handleRole: PropTypes.func.isRequired,
  handleIsActive: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('user')(UsersFilterView);
