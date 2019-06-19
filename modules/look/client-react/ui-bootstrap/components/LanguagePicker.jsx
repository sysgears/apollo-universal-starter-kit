import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const LanguagePicker = ({ i18n }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const languages = Object.keys(i18n.store.data);

  return (
    <section className="lang-section">
      {i18n.language && languages.length > 1 && (
        <Dropdown size="sm" isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
          <DropdownToggle caret>{i18n.language.slice(0, 2).toUpperCase()}</DropdownToggle>
          <DropdownMenu>
            {languages.map(lang => (
              <DropdownItem key={lang} onClick={() => i18n.changeLanguage(lang)}>
                {lang.slice(0, 2).toUpperCase()}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )}
    </section>
  );
};

LanguagePicker.propTypes = {
  i18n: PropTypes.object.isRequired
};

export default LanguagePicker;
