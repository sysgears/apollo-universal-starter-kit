import React from 'react';
import Helmet from 'react-helmet';

import { PageLayout } from '@gqlapp/look-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import settings from '@gqlapp/config';

import counters from '../counters';

interface CounterProps {
  t: TranslateFunction;
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
    {counters.counterComponent.map((component: any, idx: number, items: any) =>
      React.cloneElement(component, { key: idx + items.length })
    )}
  </PageLayout>
);

export default translate('counter')(Counter);
