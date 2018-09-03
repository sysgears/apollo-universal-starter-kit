import React from 'react';
import { TranslateFunction } from '../../../../../i18n';

import { PageLayout } from '../../../../common/components/web';

interface SubscribersOnlyViewProps {
  loading: boolean;
  subscriberNumber: number;
  t: TranslateFunction;
}

export default ({ loading, subscriberNumber, t }: SubscribersOnlyViewProps) => {
  return (
    <PageLayout>
      <h1>{t('subOnly.title')}</h1>
      <p>
        {t('subOnly.msg')} {loading ? t('subOnly.load') : subscriberNumber}.
      </p>
    </PageLayout>
  );
};
