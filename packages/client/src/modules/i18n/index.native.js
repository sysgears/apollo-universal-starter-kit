import React from 'react';
import i18n from 'i18next';
import Expo from 'expo';
import { reactI18nextModule, I18nextProvider } from 'react-i18next';

import { LanguagePicker, Root } from './components/native';
import resources from './locales';
import Feature from '../connector';

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: callback => {
    return Expo.Util.getCurrentLocaleAsync().then(lng => {
      callback(lng.replace('_', '-'));
    });
  },
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    lng: 'ru',
    resources: {},
    debug: true, // set false to hide logs
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    react: {
      wait: true
    }
  });

export default new Feature({
  drawerItem: {
    LangPicker: {
      screen: () => null,
      navigationOptions: {
        drawerLabel: <LanguagePicker key={'picker'} i18n={i18n} />
      },
      skip: true
    }
  },
  internationalization: i18n,
  localization: { ns: 'i18n', resources },
  // eslint-disable-next-line react/display-name
  rootComponentFactory: () => (
    <Root>
      <I18nextProvider i18n={i18n}>
        <div>{/* render an empty div so that the propTypes of the I18nextProvider are satisfied */}</div>
      </I18nextProvider>
    </Root>
  )
});
