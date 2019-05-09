import React from 'react';
import { default as i18next } from 'i18next';
import { I18nextProvider } from 'react-i18next';

import ClientModule from '@gqlapp/module-client-react';
import commonI18n from '@gqlapp/i18n-common-react';
import { MenuItem, LanguagePicker } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

const I18nProvider = ({ i18n, children }: any) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

const langPicker =
  settings.i18n.enabled && settings.i18n.langPickerRender
    ? new ClientModule({
        navItemRight: [
          <MenuItem key="languagePicker" className="menu-center">
            <LanguagePicker i18n={i18next} />
          </MenuItem>
        ]
      })
    : undefined;

interface Props {
  req: any;
}

class RootComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    if (this.props.req) {
      const lang = this.props.req.universalCookies.get(settings.i18n.cookie);
      i18next.changeLanguage(lang);
    }
  }

  public render() {
    return <I18nProvider i18n={i18next}>{this.props.children}</I18nProvider>;
  }
}

export default (settings.i18n.enabled
  ? new ClientModule(commonI18n, langPicker, {
      appContext: { i18n: true },
      // eslint-disable-next-line react/display-name
      rootComponentFactory: [req => <RootComponent req={req} />]
    })
  : undefined);
