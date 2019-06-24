import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Text, Platform, View } from 'react-native';
import { ActionSheet } from 'native-base';
import SimplePicker from 'react-native-simple-picker';

import { HeaderTitle } from '../..';

const LanguagePicker = ({ i18n }) => {
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const pickerRef = useRef(null);

  const changeLang = lang => {
    if (lang) {
      i18n.changeLanguage(lang);
      setCurrentLang(lang);
    }
  };

  const langs = Object.keys(i18n.store.data);

  return (
    i18n.language &&
    langs.length > 1 && (
      <View style={{ flex: 1 }}>
        <HeaderTitle
          onPress={() =>
            Platform.OS === 'ios'
              ? pickerRef.current.show()
              : ActionSheet.show(
                  {
                    options: langs.map(lang => lang.slice(0, 2).toUpperCase()),
                    title: i18n.t('i18n:pickerTitle')
                  },
                  langIndex => changeLang(langs[langIndex])
                )
          }
        >
          {i18n.t('i18n:pickerMenu')}
        </HeaderTitle>
        <Text style={{ position: 'absolute', right: 16, top: 16, color: 'rgba(0, 0, 0, .5)' }}>
          {currentLang.slice(0, 2).toUpperCase()}
        </Text>
        {Platform.OS === 'ios' && (
          <SimplePicker
            confirmText={i18n.t('i18n:btnConfirm')}
            cancelText={i18n.t('i18n:btnCancel')}
            ref={pickerRef}
            options={langs.map(lang => lang.slice(0, 2).toUpperCase())}
            onSubmit={lang => changeLang(langs.filter(lng => lng.indexOf(lang) > -1)[0] || lang)}
            buttonStyle={{ fontWeight: '700', color: '#0275d8', fontSize: 20 }}
          />
        )}
      </View>
    )
  );
};

LanguagePicker.propTypes = {
  i18n: PropTypes.object.isRequired
};

export default LanguagePicker;
