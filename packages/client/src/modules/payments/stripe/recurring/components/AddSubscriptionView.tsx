import React from 'react';
import Helmet from 'react-helmet';
import { Elements } from 'react-stripe-elements';

import { TranslateFunction } from '../../../../../i18n';
import { LayoutCenter, clientOnly } from '../../../../common/components/index.web';
import { PageLayout } from '../../../../common/components/web';
import SubscriptionCardForm from './SubscriptionCardFormView';
import settings from '../../../../../../../../settings';
import { CreditCardInput } from '../types';

const ElementsClientOnly = clientOnly(Elements);

interface AddSubscriptionViewProps {
  t: TranslateFunction;
  submitting: boolean;
  onSubmit: (subscriptionInput: CreditCardInput, stripe: any) => void;
  error: string | null;
}

export default (props: AddSubscriptionViewProps) => {
  const { t } = props;

  return (
    <PageLayout>
      <Helmet title={`${settings.app.name} - ${t('title')}`} />
      <h1 className="text-center">{t('subTitle')}</h1>
      <p>{t('add.description')}</p>
      <p>{t('add.product')}</p>
      <p>
        {t('add.price')} {settings.payments.stripe.recurring.plan.amount / 100}
      </p>
      <LayoutCenter>
        <h3 className="text-center"> {t('add.creditCard')}</h3>

        <ElementsClientOnly>
          <SubscriptionCardForm {...props} buttonName={t('add.btn')} />
        </ElementsClientOnly>
      </LayoutCenter>
    </PageLayout>
  );
};
