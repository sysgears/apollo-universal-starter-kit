import React, { Fragment } from 'react';
import Helmet from 'react-helmet';

import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { LayoutCenter } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

interface SubscribersOnlyViewProps {
  loading: boolean;
  subscriberNumber: {
    number: number;
  };
  t: TranslateFunction;
}

const SubscriberPageView = ({ loading, subscriberNumber, t }: SubscribersOnlyViewProps) => {
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

export default SubscriberPageView;
