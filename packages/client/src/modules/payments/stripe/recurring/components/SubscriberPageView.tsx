import React from 'react';
import { TranslateFunction } from '../../../../../i18n';

import { PageLayout } from '../../../../common/components/web';
import Helmet from 'react-helmet';
import settings from '../../../../../../../../settings';

interface SubscribersOnlyViewProps {
  loading: boolean;
  subscriberNumber: {
    number: number;
  };
  t: TranslateFunction;
}

export default ({ loading, subscriberNumber, t }: SubscribersOnlyViewProps) => {
  if (loading) {
    return <p>{t('loading')}</p>; // TODO: remove all loaders from translation
  }

  return (
    <PageLayout>
      <Helmet title={`${settings.app.name} - ${t('subOnly.title')}`} />
      <h1>{t('subOnly.title')}</h1>
      <p>
        {t('subOnly.msg')} {subscriberNumber.number}.
      </p>
    </PageLayout>
  );
};
