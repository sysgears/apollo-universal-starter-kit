import React from 'react';
import Helmet from 'react-helmet';
import { Elements } from 'react-stripe-elements';

import translate from '../../../../../i18n';
import { LayoutCenter, clientOnly } from '../../../../common/components/index.web';
import { PageLayout } from '../../../../common/components/web';
import SubscriptionCardForm from './SubscriptionCardForm.web';
import settings from '../../../../../../../../settings';

const ElementsClientOnly = clientOnly(Elements);

// TODO: write types
interface SubscriptionViewProps {
  onSubmit: () => void;
  t: any;
}

const SubscriptionView = (props: SubscriptionViewProps) => {
  const { onSubmit, t } = props;

  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${t('title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('meta')}`
        }
      ]}
    />
  );

  return (
    <PageLayout>
      {renderMetaData()}
      <LayoutCenter>
        <h1 className="text-center">{t('subTitle')}</h1>
        <ElementsClientOnly>
          <SubscriptionCardForm onSubmit={onSubmit} action={t('action')} />
        </ElementsClientOnly>
      </LayoutCenter>
    </PageLayout>
  );
};

export default translate('subscription')(SubscriptionView);
