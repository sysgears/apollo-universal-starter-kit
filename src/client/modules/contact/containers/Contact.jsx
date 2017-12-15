import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { reset } from 'redux-form';

import ContactView from '../components/ContactView';

import CONTACT from '../graphql/Contact.graphql';

class Contact extends React.Component {
  render() {
    return <ContactView {...this.props} />;
  }
}

const ContactWithApollo = compose(
  graphql(CONTACT, {
    props: ({ mutate }) => ({
      contact: async ({ name, email, content }) => {
        try {
          const { data: { contact } } = await mutate({
            variables: { input: { name, email, content } }
          });

          if (contact.errors) {
            return { errors: contact.errors };
          }

          return contact;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  connect(null, dispatch => ({
    onFormSubmitted() {
      dispatch(reset('contact'));
    }
  }))
)(Contact);

export default ContactWithApollo;
