import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

import { PLATFORM } from '../../utils';
import settings from '../../../../settings';
import addResourcesI18n from './addResourcesI18n';
import modules from '..';

const I18N_CONFIG: i18n.InitOptions = {
  fallbackLng: settings.i18n.fallbackLng,
  resources: {},
  debug: false, // set true to show logs
  whitelist: settings.i18n.langList,
  preload: settings.i18n.langList,
  detection: {
    lookupCookie: settings.i18n.cookie
  }
};

if (PLATFORM === 'web') {
  (I18N_CONFIG.detection as any).caches = __SSR__ ? ['cookie'] : ['sessionStorage'];
  I18N_CONFIG.interpolation = {
    escapeValue: false // not needed for React!!
  };
  I18N_CONFIG.react = {
    wait: false
  };
}

if (settings.i18n.enabled) {
  if (PLATFORM === 'web') {
    i18n.use(LanguageDetector);
  }

  i18n.use(reactI18nextModule).init(I18N_CONFIG);

  process.nextTick(() => {
    addResourcesI18n(i18n, modules.localizations);
  });
}

export default {};
