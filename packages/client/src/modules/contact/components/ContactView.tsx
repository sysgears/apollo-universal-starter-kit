import React from 'react';
import Helmet from 'react-helmet';

import { LayoutCenter } from '../../common/components/index.web';
import { PageLayout } from '../../common/components/web';
import ContactForm from './ContactForm';
import settings from '../../../../../../settings';
import { TranslateFunction } from '../../../i18n';

interface ContactViewProps {
  t: TranslateFunction;
  onSubmit: (values: any) => Promise<any>;
}

const ContactView = (props: ContactViewProps) => {
  const { t } = props;
  return (
    <PageLayout>
      <Helmet
        title={`${settings.app.name} - ${t('title')}`}
        meta={[{ name: 'description', content: `${settings.app.name} - ${t('meta')}` }]}
      />
      <LayoutCenter>
        <h1 className="text-center">{t('form.title')}</h1>
        <ContactForm {...props} />
      </LayoutCenter>
    </PageLayout>
  );
};

export default ContactView;
