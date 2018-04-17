import React from 'react';
import PropTypes from 'prop-types';
import { Text, Platform, View } from 'react-native';
import { ActionSheet } from 'native-base';
import SimplePicker from 'react-native-simple-picker';

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
    if (lang) {
      this.props.i18n.changeLanguage(lang);
      this.setState({ currentLang: lang });
    }
  }

  render() {
    const { i18n } = this.props;
    const langs = Object.keys(i18n.store.data);
    return (
      i18n.language &&
      langs.length > 1 && (
        <View style={{ flex: 1 }}>
          <HeaderTitle
            onPress={() =>
              Platform.OS === 'ios'
                ? this.pickerRef.show()
                : ActionSheet.show(
                    {
                      options: langs,
                      title: i18n.t('i18n:pickerTitle')
                    },
                    langIndex => this.changeLang(langs[langIndex])
                  )
            }
          >
            {i18n.t('i18n:pickerMenu')}
          </HeaderTitle>
          <Text style={{ position: 'absolute', right: 16, top: 16, color: 'rgba(0, 0, 0, .5)' }}>
            {this.state.currentLang.toUpperCase()}
          </Text>
          {Platform.OS === 'ios' && (
            <SimplePicker
              ref={el => (this.pickerRef = el)}
              options={langs}
              onSubmit={lang => this.changeLang(lang)}
              buttonStyle={{ fontWidth: '700', color: '#0275d8', fontSize: 20 }}
            />
          )}
        </View>
      )
    );
  }
}

LanguagePicker.propTypes = {
  i18n: PropTypes.object.isRequired
};
