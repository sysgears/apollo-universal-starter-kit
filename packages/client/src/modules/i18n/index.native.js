import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { LanguagePicker, Root } from '../../modules/common/components/native';
import resources from './locales';
import ClientModule from '../ClientModule';
import modules from '../';
import settings from '../../../../../settings';
import { addResourcesI18n } from '../../../../common/utils';

const I18nProvider = ({ i18n, children }) => {
  addResourcesI18n(i18n, modules.localizations);

  return (
    <Root>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </Root>
  );
};

I18nProvider.propTypes = {
  i18n: PropTypes.object,
  children: PropTypes.node
};

const langPicker =
  settings.i18n.enabled && settings.i18n.langPickerRender
    ? new ClientModule({
        drawerItem: [
          {
            LangPicker: {
              screen: () => null,
              navigationOptions: {
                drawerLabel: <LanguagePicker key={'picker'} i18n={i18n} />
              },
              skip: true
            }
          }
        ]
      })
    : undefined;

export default (settings.i18n.enabled
  ? new ClientModule(langPicker, {
      localization: [{ ns: 'i18n', resources }],
      // eslint-disable-next-line react/display-name
      rootComponentFactory: [() => <I18nProvider i18n={i18n} />]
    })
  : undefined);
