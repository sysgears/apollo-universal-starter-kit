import React from 'react';
import { TranslateFunction } from '../../../../../i18n';

import { PageLayout } from '../../../../common/components/web';

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
      <h1>{t('subOnly.title')}</h1>
      <p>
        {t('subOnly.msg')} {loading ? t('subOnly.load') : subscriberNumber.number}.
      </p>
    </PageLayout>
  );
};
