/* Entities */
interface Contact {
  name: string;
  email: string;
  content: string;
}

/* ComponentProps */
interface ContactState {
  sent: boolean;
}

interface ContactError {
  field: string;
  message: string;
}

interface ContactErrors {
  errors: ContactError[];
}

/* Types */
type SendContactFn = (contactData: Contact) => boolean | ContactErrors;

interface ContactOperations {
  contact: SendContactFn;
}

// tslint:disable-next-line:no-empty-interface
interface ContactProps extends ContactOperations {}

interface ContactFormikProps {
  onSubmit: (options?: any) => void;
  sent?: boolean;
}

export { Contact };
export { SendContactFn };
export { ContactOperations, ContactProps, ContactState, ContactError, ContactFormikProps, ContactErrors };
