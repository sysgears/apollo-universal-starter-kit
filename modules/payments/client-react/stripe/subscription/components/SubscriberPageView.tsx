import React, { Fragment } from 'react';
import Helmet from 'react-helmet';
import { TranslateFunction } from '@module/i18n-client-react';
import { LayoutCenter } from '@module/look-client-react';

import settings from '../../../../../../settings';

interface SubscribersOnlyViewProps {
  loading: boolean;
  subscriberNumber: {
    number: number;
  };
  t: TranslateFunction;
}

export default ({ loading, subscriberNumber, t }: SubscribersOnlyViewProps) => {
  if (loading) {
    return <p>{t('loading')}</p>;
  }

  return (
    <Fragment>
      <Helmet title={`${settings.app.name} - ${t('subscriberPage.title')}`} />
      <LayoutCenter>
        <h1 className="text-center">{t('subscriberPage.title')}</h1>
      </LayoutCenter>
      <p>
        {t('subscriberPage.msg')} {subscriberNumber.number}.
      </p>
    </Fragment>
  );
};
