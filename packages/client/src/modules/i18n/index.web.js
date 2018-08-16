import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule, I18nextProvider } from 'react-i18next';

import Feature from '../connector';
import { MenuItem, LanguagePicker } from '../../modules/common/components/web';
import modules from '../';
import settings from '../../../../../settings';

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

const I18N_CONFIG = {
  fallbackLng: settings.i18n.fallbackLng,
  resources: {},
  debug: false, // set true to show logs
  whitelist: settings.i18n.langList,
  detection: {
    lookupCookie: settings.i18n.cookie,
    caches: __SSR__ ? ['cookie'] : ['localStorage']
  },
  interpolation: {
    escapeValue: false // not needed for react!!
  },
  react: {
    wait: false
  }
};

if (__CLIENT__) {
  i18n.use(LanguageDetector);
}

i18n.use(reactI18nextModule).init(I18N_CONFIG);

const langPicker = {};
if (settings.i18n.enabled && settings.i18n.langPickerRender) {
  langPicker.navItemRight = (
    <MenuItem key="languagePicker" style={{ display: 'flex', alignItems: 'center' }}>
      <LanguagePicker i18n={i18n} />
    </MenuItem>
  );
}

class RootComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    if (this.props.req) {
      const lang = this.props.req.universalCookies.get(settings.i18n.cookie);
      i18n.changeLanguage(lang);
    }
  }

  render() {
    return <I18nProvider i18n={i18n}>{this.props.children}</I18nProvider>;
  }
}

RootComponent.propTypes = {
  req: PropTypes.object,
  children: PropTypes.node
};

export default new Feature(
  settings.i18n.enabled
    ? {
        data: { i18n: true },
        // eslint-disable-next-line react/display-name
        rootComponentFactory: req => <RootComponent req={req} />,
        ...langPicker
      }
    : {}
);
