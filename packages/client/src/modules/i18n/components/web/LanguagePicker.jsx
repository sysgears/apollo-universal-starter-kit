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
    const { i18n: { store: { data }, language, languages, changeLanguage } } = this.props;
    return (
      <section className="lang-section">
        {language &&
          Object.keys(data).length > 1 && (
            <Dropdown size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle caret>{languages[1].toUpperCase()}</DropdownToggle>
              <DropdownMenu>
                {Object.keys(data).map(lang => (
                  <DropdownItem key={lang} onClick={() => changeLanguage(lang)}>
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
