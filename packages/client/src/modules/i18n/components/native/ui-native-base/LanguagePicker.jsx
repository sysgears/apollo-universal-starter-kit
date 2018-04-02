import React from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'native-base';

const Item = Picker.Item;

export default class LanguagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.changeLang = this.changeLang.bind(this);
    this.state = {
      currentLang: this.props.i18n.language.slice(0, 2)
    };
  }

  changeLang(lang) {
    this.props.i18n.changeLanguage(lang);
    this.setState({ currentLang: lang });
  }

  render() {
    const { i18n } = this.props;
    const langs = Object.keys(i18n.store.data);
    return (
      i18n.language &&
      langs.length > 1 && (
        <Picker
          iosHeader={i18n.t('i18n:iosPickerTitle')}
          mode="dropdown"
          selectedValue={this.state.currentLang}
          onValueChange={this.changeLang}
        >
          {langs.map(lang => <Item key={lang} label={lang.toUpperCase()} value={lang} />)}
        </Picker>
      )
    );
  }
}

LanguagePicker.propTypes = {
  i18n: PropTypes.object.isRequired
};
