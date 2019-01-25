import React from 'react';
import Helmet from 'react-helmet';

import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { LayoutCenter, PageLayout } from '@gqlapp/look-client-react';
import ContactForm from './ContactForm';
import { ContactForm as IContactForm } from '../types';
import settings from '../../../../settings';

interface ContactViewProps {
  t: TranslateFunction;
  onSubmit: (values: IContactForm) => void;
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
