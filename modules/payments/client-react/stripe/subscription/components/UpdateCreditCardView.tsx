import React, { Fragment } from 'react';
import Helmet from 'react-helmet';
import { Elements } from 'react-stripe-elements';
import { TranslateFunction } from '@module/i18n-client-react';
import { LayoutCenter } from '@module/look-client-react';

import SubscriptionCardForm from './SubscriptionCardFormView';
import settings from '../../../../../../settings';
import { CreditCardInput } from '../types';

interface UpdateCardViewProps {
  onSubmit: (subscriptionInput: CreditCardInput, stripe: any) => void;
  t: TranslateFunction;
  submitting: boolean;
  error: string | null;
}

export default (props: UpdateCardViewProps) => {
  const { t } = props;

  return (
    <Fragment>
      <Helmet title={`${settings.app.name} - ${t('update.title')}`} />
      <LayoutCenter>
        <h1 className="text-center">{t('update.title')}</h1>
        <Elements>
          <SubscriptionCardForm {...props} buttonName={t('update.btn')} />
        </Elements>
      </LayoutCenter>
    </Fragment>
  );
};
