import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon } from 'antd';

const LanguagePicker = ({ i18n }) => {
  const languages = Object.keys(i18n.store.data);

  const getMenuItems = () => (
    <Menu onClick={({ key }) => i18n.changeLanguage(key)}>
      {Object.keys(i18n.store.data).map(lang => (
        <Menu.Item key={lang}>{lang.slice(0, 2).toUpperCase()}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      {languages.length > 1 && (
        <Dropdown overlay={getMenuItems()}>
          <a className="ant-dropdown-link" href="#">
            {i18n.language.slice(0, 2).toUpperCase()} <Icon type="down" />
          </a>
        </Dropdown>
      )}
    </>
  );
};

LanguagePicker.propTypes = {
  i18n: PropTypes.object.isRequired
};

export default LanguagePicker;
