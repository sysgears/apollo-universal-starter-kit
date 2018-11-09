import React from 'react';
import { Mutation, MutationFn } from 'react-apollo';

import ContactView from '../components/ContactView';

import CONTACT from '../graphql/Contact.graphql';
import translate, { TranslateFunction } from '../../../i18n';
import { ContactFields } from '../types';

class Contact extends React.Component<{ t: TranslateFunction }> {
  // TODO: Add types for values
  public onSubmit = (contact: MutationFn) => async (values: ContactFields) => {
    // const { t } = this.props;
    // const result = await contact({ variables: { input: values } });
    //
    // console.log('datadatadata', result);
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
