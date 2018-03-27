/* Entities */
interface Contact {
  name: string;
  email: string;
  content: string;
}

/* Errors */
interface ContactError {
  field: string;
  message: string;
}

interface ContactErrors {
  errors: ContactError[];
}

/* Types */
type SendContactFn = (values: Contact) => Promise<boolean | ContactErrors>;

/* State */
interface ContactState {
  sent: boolean;
}

/* ComponentProps */
interface ContactOperation {
  contact: SendContactFn;
}

// tslint:disable-next-line:no-empty-interface
interface ContactProps extends ContactOperation {}

interface ContactFormProps {
  onSubmit: (options?: any) => void;
  sent?: boolean;
}

export { Contact };
export { SendContactFn };
export { ContactOperation, ContactProps, ContactState, ContactError, ContactFormProps };
