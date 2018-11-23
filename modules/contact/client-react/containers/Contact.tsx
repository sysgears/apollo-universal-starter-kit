import React from 'react';
import { Mutation, MutationFn, FetchResult } from 'react-apollo';

import { translate, TranslateFunction } from '@module/i18n-client-react';
import ContactView from '../components/ContactView';
import CONTACT from '../graphql/Contact.graphql';
import { ContactForm } from '../types';

class Contact extends React.Component<{ t: TranslateFunction }> {
  public onSubmit = (contactMutate: MutationFn) => async (values: ContactForm) => {
    const { t } = this.props;

    try {
      const {
        data: { contact }
      } = (await contactMutate({ variables: { input: values } })) as FetchResult;
      return { errors: contact.errors ? contact.errors : undefined };
    } catch (e) {
      return { errors: { serverError: t('serverError') } };
    }
  };

  public render() {
    return (
      <Mutation mutation={CONTACT}>
        {mutate => <ContactView {...this.props} onSubmit={this.onSubmit(mutate)} />}
      </Mutation>
    );
  }
}

export default translate('contact')(Contact);
