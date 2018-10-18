import React from 'react';
import { Mutation } from 'react-apollo';

import ContactView from '../components/ContactView';

import CONTACT from '../graphql/Contact.graphql';
import translate from '../../../i18n';

const Contact = props => (
  <Mutation mutation={CONTACT}>{contact => <ContactView {...props} contact={contact} />}</Mutation>
);

export default translate('contact')(Contact);
