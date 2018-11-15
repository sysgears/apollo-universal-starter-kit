import React from 'react';
import Helmet from 'react-helmet';

import { TranslateFunction } from '@module/i18n-client-react';
import { LayoutCenter } from '../../../../packages/client/src/modules/common/components/index.web';
import { PageLayout } from '../../../../packages/client/src/modules/common/components/web';
import ContactForm from './ContactForm';
import { ContactForm as IContactForm } from '../types';
import settings from '../../../../settings';

interface ContactViewProps {
  t: TranslateFunction;
  onSubmit: (values: IContactForm) => Promise<{ errors: Array<{ field: string; message: string }> }>;
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
