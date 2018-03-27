import React from 'react';
import { compose } from 'react-apollo';

import ContactView from '../components/ContactView.web';
import { ContactProps } from '../types';
import { withContactSending } from '../graphql';

class ContactComponent extends React.Component<ContactProps, any> {
  public render() {
    return <ContactView {...this.props} />;
  }
}

export default compose(withContactSending)(ContactComponent);
