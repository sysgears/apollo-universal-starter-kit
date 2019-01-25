import React from 'react';
import { Mutation, FetchResult } from 'react-apollo';
import { FormError } from '@gqlapp/forms-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import ContactView from '../components/ContactView';
import CONTACT from '../graphql/Contact.graphql';
import { ContactForm } from '../types';

@translate('contact')
class Contact extends React.Component<{ t: TranslateFunction }> {
  public onSubmit = (sendContact: any) => async (values: ContactForm) => {
    const { t } = this.props;

    try {
      await sendContact(values);
    } catch (e) {
      throw new FormError(t('serverError'), e);
    }
  };

  public render() {
    return (
      <Mutation mutation={CONTACT}>
        {mutate => {
          const sendContact = async (values: ContactForm) => {
            const {
              data: { contact }
            } = (await mutate({ variables: { input: values } })) as FetchResult;
            return contact;
          };
          return <ContactView {...this.props} onSubmit={this.onSubmit(sendContact)} />;
        }}
      </Mutation>
    );
  }
}

export default Contact;
