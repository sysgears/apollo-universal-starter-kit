import { graphql, OptionProps } from 'react-apollo';

import { Contact, ContactOperation } from '../types';
import CONTACT from './Contact.graphql';

const withContactSending = graphql(CONTACT, {
  props: ({ mutate }: OptionProps<any, ContactOperation>) => ({
    contact: async ({ name, email, content }: Contact) => {
      try {
        const { data: { contact } }: any = await mutate({
          variables: { input: { name, email, content } }
        });

        if (contact.errors) {
          return { errors: contact.errors };
        }

        return contact;
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.log(e.graphQLErrors);
      }
    }
  })
});

export { withContactSending };
