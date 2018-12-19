import React from 'react';
import { Mutation, MutationFn, FetchResult, compose } from 'react-apollo';
import { formikMessageHandler, HandleError } from '@module/core-client-react';
import { translate, TranslateFunction } from '@module/i18n-client-react';
import ContactView from '../components/ContactView';
import CONTACT from '../graphql/Contact.graphql';
import { ContactForm } from '../types';

class Contact extends React.Component<{ t: TranslateFunction; handleError: HandleError }> {
  public onSubmit = (mutate: MutationFn) => async (values: ContactForm) => {
    const { t, handleError } = this.props;

    const {
      data: { contact }
    } = (await mutate({ variables: { input: values } })) as FetchResult;

    await handleError(async () => contact, t('serverError'));
  };

  public render() {
    return (
      <Mutation mutation={CONTACT}>
        {mutate => <ContactView {...this.props} onSubmit={this.onSubmit(mutate)} />}
      </Mutation>
    );
  }
}

export default compose(
  translate('contact'),
  formikMessageHandler
)(Contact);
