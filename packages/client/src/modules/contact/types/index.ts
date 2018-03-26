/* Entities */
interface Contact {
  name: string;
  email: string;
  content: string;
}

/* ComponentProps */
interface ContactOperations {
  contact: (contactData: Contact) => boolean;
}

interface ContactProps extends ContactOperations {}

export { Contact, ContactOperations, ContactProps };
