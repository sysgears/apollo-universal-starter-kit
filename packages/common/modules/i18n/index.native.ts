import i18n from 'i18next';
import * as Expo from 'expo';
import { reactI18nextModule } from 'react-i18next';

import settings from '../../../../settings';
import addResourcesI18n from './addResourcesI18n';
import modules from '..';

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: async (callback: (lang: string) => string) => {
    const lng = await Expo.SecureStore.getItemAsync('i18nextLng');
    return callback(lng || (await (Expo as any).Localization.getLocalizationAsync()).locale.replace('_', '-'));
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    Expo.SecureStore.setItemAsync('i18nextLng', lng);
  }
};

if (settings.i18n.enabled) {
  i18n
    .use(languageDetector)
    .use(reactI18nextModule)
    .init({
      fallbackLng: settings.i18n.fallbackLng,
      resources: {},
      debug: false, // set true to show logs
      whitelist: settings.i18n.langList,
      interpolation: {
        escapeValue: false // not needed for react!!
      },
      react: {
        wait: false
      }
    });
  process.nextTick(() => {
    addResourcesI18n(i18n, modules.localizations);
  });
}

export default {};
