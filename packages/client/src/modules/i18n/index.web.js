import React from 'react';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

import Feature from '../connector';
import LanguagePicker from './components/LanguagePicker';
import { MenuItem } from '../../modules/common/components/web';

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    react: {
      wait: true
    }
  });

export default new Feature({
  navItemRight: (
    <MenuItem key="languagePicker">
      <LanguagePicker i18n={i18n} />
    </MenuItem>
  ),
  internationalization: i18n
});
