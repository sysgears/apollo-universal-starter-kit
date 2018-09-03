import React from 'react';
import Helmet from 'react-helmet';
import { Elements } from 'react-stripe-elements';

import { TranslateFunction } from '../../../../../i18n';
import { LayoutCenter } from '../../../../common/components/web';
import { PageLayout } from '../../../../common/components/web';

import SubscriptionCardForm from './SubscriptionCardFormView';
import settings from '../../../../../../../../settings';

interface UpdateCardViewProps {
  onSubmit: () => void; // TODO: write types
  t: TranslateFunction;
}

export default ({ onSubmit, t }: UpdateCardViewProps) => (
  <PageLayout>
    <Helmet
      title={`${settings.app.name} - ${t('update.title')}`}
      meta={[{ name: 'description', content: `${settings.app.name} - ${t('update.meta')}` }]}
    />
    <LayoutCenter>
      <h1 className="text-center">{t('update.subTitle')}</h1>
      <Elements>
        <SubscriptionCardForm onSubmit={onSubmit} action={t('update.action')} />
      </Elements>
    </LayoutCenter>
  </PageLayout>
);
