import React from 'react';
import { Mutation, FetchResult, compose } from 'react-apollo';
import { withHandlerErrorMessage, HandleError } from '@module/forms-client-react';
import { translate, TranslateFunction } from '@module/i18n-client-react';
import ContactView from '../components/ContactView';
import CONTACT from '../graphql/Contact.graphql';
import { ContactForm } from '../types';

class Contact extends React.Component<{ t: TranslateFunction; handleError: HandleError }> {
  public onSubmit = (sendContact: any) => async (values: ContactForm) => {
    const { t, handleError } = this.props;
    await handleError(() => sendContact(values), t('serverError'));
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

export default compose(
  translate('contact'),
  withHandlerErrorMessage
)(Contact);
