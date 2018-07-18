import React from 'react';
import { Mutation } from 'react-apollo';

import ContactView from '../components/ContactView';

import CONTACT from '../graphql/Contact.graphql';

class Contact extends React.Component {
  render() {
    return (
      <Mutation mutation={CONTACT}>
        {mutate => {
          const addContact = async contactInput => {
            try {
              const contact = await mutate({ variables: { input: contactInput } });

              if (contact.errors) {
                return { errors: contact.errors };
              }

              return contact;
            } catch (e) {
              console.log('ERROR', e.graphQLErrors);
            }
          };

          return <ContactView onSubmit={addContact} {...this.props} />;
        }}
      </Mutation>
    );
  }
}

export default Contact;
