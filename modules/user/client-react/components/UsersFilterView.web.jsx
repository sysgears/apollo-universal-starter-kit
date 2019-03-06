import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';
import { translate } from '@gqlapp/i18n-client-react';
import { Form, FormItem, Select, Option, Label, Input } from '@gqlapp/look-client-react';

const UsersFilterView = ({
  filter: { searchText, role, isActive },
  onSearchTextChange,
  onRoleChange,
  onIsActiveChange,
  t
}) => (
  <Form layout="inline">
    <FormItem label={t('users.list.item.filter')}>
      <DebounceInput
        minLength={2}
        debounceTimeout={300}
        placeholder={t('users.list.item.search')}
        element={Input}
        value={searchText}
        onChange={e => onSearchTextChange(e.target.value)}
      />
    </FormItem>
    &nbsp;
    <FormItem label={t('users.list.item.role.label')}>
      <Select name="role" defaultValue={role} onChange={e => onRoleChange(e.target.value)}>
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
        <Input type="checkbox" defaultChecked={isActive} onChange={() => onIsActiveChange(!isActive)} />
        {t('users.list.item.active')}
      </Label>
    </FormItem>
  </Form>
);

UsersFilterView.propTypes = {
  filter: PropTypes.object.isRequired,
  onSearchTextChange: PropTypes.func.isRequired,
  onRoleChange: PropTypes.func.isRequired,
  onIsActiveChange: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('user')(UsersFilterView);
