import { graphql, OptionProps } from 'react-apollo';

import { Contact, ContactOperation } from '../types';
import CONTACT from './Contact.graphql';

/**
 * Sends a contact from.
 *
 * @param Component to be wrapped with the HOC
 */
const withContactSending = (Component: any) =>
  graphql(CONTACT, {
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
  })(Component);

export { withContactSending };
