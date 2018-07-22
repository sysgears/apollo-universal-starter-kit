import React from 'react';
import Helmet from 'react-helmet';

import { PageLayout } from '../../common/components/web';
import settings from '../../../../../../settings';
import translate from '../../../i18n';
import { ClientCounter } from '../clientCounter';
import { ServerCounter } from '../serverCounter';
import { ReduxCounter } from '../reduxCounter';
import { TranslateFunc } from '..';

interface CounterProps {
  t: TranslateFunc;
}

const Counter = ({ t }: CounterProps) => (
  <PageLayout>
    <Helmet
      title={`${settings.app.name} - ${t('title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('meta')}`
        }
      ]}
    />
    <ServerCounter />
    <ReduxCounter />
    <ClientCounter />
  </PageLayout>
);

export default translate('counter')(Counter);
