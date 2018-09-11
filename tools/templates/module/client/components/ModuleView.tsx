import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';
import { TranslateFunction } from '../../../i18n';
import settings from '../../../../../../settings';

interface $Module$ViewProps {
  t: TranslateFunction;
}

const renderMetaData = (t: TranslateFunction) => (
  <Helmet
    title={`${settings.app.name} - ${t('title')}`}
    meta={[{ name: 'description', content: `${settings.app.name} - ${t('meta')}` }]}
  />
);

const $Module$View = ({ t }: $Module$ViewProps) => {
  return (
    <PageLayout>
      {renderMetaData(t)}
      <div className="text-center">
        <p>{t('welcomeText')}</p>
      </div>
    </PageLayout>
  );
};

export default $Module$View;
