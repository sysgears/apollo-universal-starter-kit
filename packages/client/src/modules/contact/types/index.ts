import { Errors } from '../../../../../common/types';

/* Entities */
interface Contact {
  name: string;
  email: string;
  content: string;
}

/* Types */
type SendContactFn = (values: Contact) => Promise<boolean | Errors>;

/* Component State */
interface ContactState {
  sent: boolean;
}

/* Component Props */
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
export { ContactOperation, ContactProps, ContactState, ContactFormProps };
