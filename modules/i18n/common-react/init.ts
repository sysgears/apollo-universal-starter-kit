import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';

import { PLATFORM } from '@gqlapp/core-common';
import settings from '@gqlapp/config';

import LanguageDetector from './LanguageDetector';

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

if (['mobile', 'web'].indexOf(PLATFORM) >= 0) {
  if (PLATFORM === 'web') {
    (I18N_CONFIG.detection as any).caches = __SSR__ ? ['cookie'] : ['sessionStorage'];
  }
  I18N_CONFIG.interpolation = {
    escapeValue: false // not needed for React!!
  };
  I18N_CONFIG.react = {
    wait: false
  };
}

if (settings.i18n.enabled) {
  if (['mobile', 'web'].indexOf(PLATFORM) >= 0) {
    i18n.use(LanguageDetector);
  }

  i18n.use(reactI18nextModule).init(I18N_CONFIG);
}
