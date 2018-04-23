import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule, I18nextProvider } from 'react-i18next';
import Cookies from 'universal-cookie';

import Feature from '../connector';
import LanguagePicker from './components/web/LanguagePicker';
import { LayoutCenter } from '../common/components';
import { MenuItem } from '../../modules/common/components/web';
import modules from '../';
import settings from '../../../../../settings';

const clientCookies = new Cookies();

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

const LANG_COOKIE = 'lang';

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en-US',
    resources: {},
    lng: settings.i18n.defaultLang,
    debug: false, // set true to show logs
    whitelist: ['en-US', 'ru-RU'],
    detection: {
      lookupCookie: LANG_COOKIE,
      caches: __SSR__ ? ['cookie'] : ['localStorage']
    },
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    react: {
      wait: false
    }
  });

const langPicker = {};
if (settings.i18n.langPickerRender) {
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
    const cookies = this.props.req ? this.props.req.universalCookies : clientCookies;
    const lang = cookies.get(LANG_COOKIE);
    if (lang) {
      i18n.changeLanguage(lang);
    }
    this.state = { ready: !!lang || !__SSR__ };
  }

  componentDidMount() {
    if (!this.state.ready) {
      this.setState({ ready: true });
    }
  }

  render() {
    return this.state.ready ? (
      <I18nProvider i18n={i18n}>{this.props.children}</I18nProvider>
    ) : (
      <LayoutCenter>
        <div className="text-center">Detecting language...</div>
      </LayoutCenter>
    );
  }
}

RootComponent.propTypes = {
  req: PropTypes.object,
  children: PropTypes.node
};

export default new Feature({
  data: { i18n: true },
  // eslint-disable-next-line react/display-name
  rootComponentFactory: req => <RootComponent req={req} />,
  ...langPicker
});
