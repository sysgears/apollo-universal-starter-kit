import React from 'react';
import i18n from 'i18next';
import Expo from 'expo';
import { reactI18nextModule, I18nextProvider } from 'react-i18next';

import { LanguagePicker } from './components/native';
import Feature from '../connector';

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: callback => {
    return /*'en'; */ Expo.Util.getCurrentLocaleAsync().then(lng => {
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
  internationalization: i18n,
  drawerFooterItem: <LanguagePicker key={'picker'} i18n={i18n} />,
  // eslint-disable-next-line react/display-name
  rootComponentFactory: () => (
    <I18nextProvider i18n={i18n}>
      <div>{/* render an empty div so that the propTypes of the I18nextProvider are satisfied */}</div>
    </I18nextProvider>
  )
});
