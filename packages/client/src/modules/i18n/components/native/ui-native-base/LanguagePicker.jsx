import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { ActionSheet } from 'native-base';

import { HeaderTitle } from '../../../../common/components/native';

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
        <View>
          <HeaderTitle
            onPress={() =>
              ActionSheet.show(
                {
                  options: langs,
                  title: i18n.t('i18n:pickerTitle')
                },
                langIndex => this.changeLang(langs[langIndex])
              )
            }
          >
            {i18n.t('i18n:pickerTitle')}
          </HeaderTitle>
        </View>
      )
    );
  }
}

LanguagePicker.propTypes = {
  i18n: PropTypes.object.isRequired
};
