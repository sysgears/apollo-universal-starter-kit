import React from 'react';
import Helmet from 'react-helmet';
import { Elements } from 'react-stripe-elements';

import { TranslateFunction } from '../../../../../i18n';
import { LayoutCenter, clientOnly } from '../../../../common/components/index.web';
import { PageLayout } from '../../../../common/components/web';
import SubscriptionCardForm from './SubscriptionCardFormView';
import settings from '../../../../../../../../settings';

const ElementsClientOnly = clientOnly(Elements);

interface SubscriptionViewProps {
  onSubmit: (values: any) => void; // TODO: write types
  t: TranslateFunction;
  submitting: boolean;
}

export default ({ onSubmit, t, submitting }: SubscriptionViewProps) => (
  <PageLayout>
    <Helmet
      title={`${settings.app.name} - ${t('title')}`}
      meta={[{ name: 'description', content: `${settings.app.name} - ${t('meta')}` }]}
    />
    <LayoutCenter>
      <h1 className="text-center">{t('subTitle')}</h1>
      <ElementsClientOnly>
        <SubscriptionCardForm submitting={submitting} onSubmit={onSubmit} buttonName={t('action')} />
      </ElementsClientOnly>
    </LayoutCenter>
  </PageLayout>
);
