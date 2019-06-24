import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Picker, List } from 'antd-mobile-rn';

import { HeaderTitle } from '../..';

const LanguagePicker = ({ i18n }) => {
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const langs = Object.keys(i18n.store.data);

  const changeLang = lang => {
    if (lang && lang.length) {
      i18n.changeLanguage(lang[0]);
      setCurrentLang(lang[0]);
    }
  };

  return (
    i18n.language &&
    langs.length > 1 && (
      <View style={{ flex: 1 }}>
        <Picker
          extra={currentLang.slice(0, 2).toUpperCase()}
          data={langs.map(lang => {
            return { value: lang, label: lang.slice(0, 2).toUpperCase() };
          })}
          cols={1}
          okText="Confirm"
          dismissText="Cancel"
          onChange={changeLang}
        >
          <List.Item arrow="empty">
            <HeaderTitle
              style={{
                paddingVertical: 10,
                fontWeight: 'bold'
              }}
            >
              <Text>{i18n.t('i18n:pickerMenu')}</Text>
            </HeaderTitle>
          </List.Item>
        </Picker>
      </View>
    )
  );
};

LanguagePicker.propTypes = {
  i18n: PropTypes.object.isRequired
};

export default LanguagePicker;
