import React from 'react';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule, I18nextProvider } from 'react-i18next';

import Feature from '../connector';
import LanguagePicker from './components/web/LanguagePicker';
import { MenuItem } from '../../modules/common/components/web';

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    resources: {},
    debug: false, // set true to show logs
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    react: {
      wait: true
    }
  });

export default new Feature({
  navItemRight: (
    <MenuItem key="languagePicker" style={{ display: 'flex', alignItems: 'center' }}>
      <LanguagePicker i18n={i18n} />
    </MenuItem>
  ),
  internationalization: i18n,
  // eslint-disable-next-line react/display-name
  rootComponentFactory: () => (
    <I18nextProvider i18n={i18n}>
      <div>{/* render an empty div so that the propTypes of the I18nextProvider are satisfied */}</div>
    </I18nextProvider>
  )
});
