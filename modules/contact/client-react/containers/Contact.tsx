import React from 'react';
import { FetchResult, compose, graphql } from 'react-apollo';

import { formikMessageHandler, HandleError } from '@module/core-client-react';
import { translate, TranslateFunction } from '@module/i18n-client-react';
import ContactView from '../components/ContactView';
import CONTACT from '../graphql/Contact.graphql';
import { ContactForm } from '../types';

interface ContactProps {
  t: TranslateFunction;
  handleError: HandleError;
  contact: (values: ContactForm) => Promise<{ errors: Array<{ field: string; message: string }> }>;
}

class Contact extends React.Component<ContactProps> {
  public onSubmit = async (values: ContactForm) => {
    const { t, handleError, contact } = this.props;
    await handleError(() => contact(values), t('serverError'));
  };

  public render() {
    return <ContactView {...this.props} onSubmit={this.onSubmit} />;
  }
}

const ContactWithApollo = compose(
  translate('contact'),
  formikMessageHandler,
  graphql(CONTACT, {
    props: ({ mutate }) => ({
      contact: async (values: any) => {
        try {
          const {
            data: { contact }
          } = (await mutate({ variables: { input: values } })) as FetchResult;
          return contact;
        } catch (e) {
          throw e;
        }
      }
    })
  })
)(Contact);
export default ContactWithApollo;
