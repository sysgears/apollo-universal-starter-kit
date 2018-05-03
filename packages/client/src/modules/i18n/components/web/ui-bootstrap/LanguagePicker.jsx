import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class LanguagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    const { i18n } = this.props;
    const languages = Object.keys(i18n.store.data);
    return (
      <section className="lang-section">
        {i18n.language &&
          languages.length > 1 && (
            <Dropdown size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
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
  }
}

LanguagePicker.propTypes = {
  i18n: PropTypes.object.isRequired
};
