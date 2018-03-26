import React from 'react';
import { compose } from 'react-apollo';

import ContactView from '../components/ContactView.native';
import { ContactProps } from '../types';
import { withContactSending } from '../graphql';

class ContactComponent extends React.Component<ContactProps, any> {
  public render() {
    return <ContactView {...this.props} />;
  }
}

const ContactWithApollo = compose(withContactSending)(ContactComponent);

export default ContactWithApollo;
