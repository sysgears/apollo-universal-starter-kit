import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule, I18nextProvider } from 'react-i18next';

import Feature from '../connector';
import LanguagePicker from './components/web/LanguagePicker';
import { MenuItem } from '../../modules/common/components/web';
import modules from '../';

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
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

I18nProvider.propTypes = {
  i18n: PropTypes.object,
  children: PropTypes.node
};

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en-US',
    resources: {},
    debug: false, // set true to show logs
    whitelist: ['en-US', 'ru-RU'],
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    react: {
      wait: __CLIENT__
    }
  });

export default new Feature({
  navItemRight: (
    <MenuItem key="languagePicker" style={{ display: 'flex', alignItems: 'center' }}>
      <LanguagePicker i18n={i18n} />
    </MenuItem>
  ),
  // eslint-disable-next-line react/display-name
  rootComponentFactory: () => <I18nProvider i18n={i18n} />
});
