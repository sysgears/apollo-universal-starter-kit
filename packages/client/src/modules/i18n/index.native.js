import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { DangerZone } from 'expo';
import { reactI18nextModule, I18nextProvider } from 'react-i18next';

import { getItem, setItem } from '../common/clientStorage';
import { LanguagePicker, Root } from '../../modules/common/components/native';
import resources from './locales';
import Feature from '../connector';
import modules from '../';
import settings from '../../../../../settings';

const { Localization } = DangerZone;

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: async callback => {
    let lng = await getItem('i18nextLng');
    return callback(lng || (await Localization.getCurrentLocaleAsync()).replace('_', '-'));
  },
  init: () => {},
  cacheUserLanguage: async lng => {
    setItem('i18nextLng', lng);
  }
};

const I18nProvider = ({ i18n, children }) => {
  for (const localization of modules.localizations) {
    for (const lang of Object.keys(localization.resources)) {
      i18n.addResourceBundle(
        i18n.options.whitelist.filter(lng => lng.indexOf(lang) > -1)[0] || lang,
        localization.ns,
        localization.resources[lang]
      );
    }
  }

  return (
    <Root>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </Root>
  );
};

I18nProvider.propTypes = {
  i18n: PropTypes.object,
  children: PropTypes.node
};

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en-US',
    resources: {},
    lng: settings.i18n.defaultLang,
    debug: false, // set true to show logs
    whitelist: ['en-US', 'ru-RU'],
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    react: {
      wait: false
    }
  });

const langPicker = {};
if (settings.i18n.langPickerRender) {
  langPicker.drawerItem = {
    LangPicker: {
      screen: () => null,
      navigationOptions: {
        drawerLabel: <LanguagePicker key={'picker'} i18n={i18n} />
      },
      skip: true
    }
  };
}

export default new Feature({
  ...langPicker,
  localization: { ns: 'i18n', resources },
  // eslint-disable-next-line react/display-name
  rootComponentFactory: () => <I18nProvider i18n={i18n} />
});
