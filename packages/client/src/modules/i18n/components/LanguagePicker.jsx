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
    const langs = Object.keys(i18n.store.data);
    return (
      <section className="lang-section">
        {langs.length > 1 && (
          <Dropdown size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>{i18n.language.toUpperCase()}</DropdownToggle>
            <DropdownMenu>
              {langs.map(lang => (
                <DropdownItem key={lang} onClick={() => i18n.changeLanguage(lang)}>
                  {lang.toUpperCase()}
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
