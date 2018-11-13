import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

import ClientModule from '../ClientModule';
import { MenuItem, LanguagePicker } from '../../modules/common/components/web';
import modules from '../';
import settings from '../../../../../settings';
import addResourcesI18n from '../../../../common/modules/i18n/addResourcesI18n';

const I18nProvider = ({ i18n, children }) => {
  addResourcesI18n(i18n, modules.localizations);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

I18nProvider.propTypes = {
  i18n: PropTypes.object,
  children: PropTypes.node
};

const langPicker =
  settings.i18n.enabled && settings.i18n.langPickerRender
    ? new ClientModule({
        navItemRight: [
          <MenuItem key="languagePicker" className="menu-center">
            <LanguagePicker i18n={i18n} />
          </MenuItem>
        ]
      })
    : undefined;

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

export default (settings.i18n.enabled
  ? new ClientModule(langPicker, {
      data: { i18n: true },
      // eslint-disable-next-line react/display-name
      rootComponentFactory: [req => <RootComponent req={req} />]
    })
  : undefined);
