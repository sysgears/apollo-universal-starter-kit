import { Component } from '@angular/core';
import React from 'react';
import Helmet from 'react-helmet';

import { PageLayout } from '../../common/components/web';
import settings from '../../../../../../settings';
import translate, { TranslateFunction } from '../../../i18n';
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

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <server-counter></server-counter>
      <client-counter></client-counter>
    </div>
  `
})
export class CounterComponent {}
