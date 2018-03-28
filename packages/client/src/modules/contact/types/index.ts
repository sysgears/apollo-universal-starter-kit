import { Errors } from '../../../../../common/types';

/* --- TYPES --- */
type SendContactFn = (values: Contact) => Promise<boolean | Errors>;

/* --- ENTITIES --- */

interface Contact {
  name: string;
  email: string;
  content: string;
}

/* --- COMPONENT STATE--- */

interface ContactState {
  sent: boolean;
}

/* --- COMPONENT PROPS --- */

interface ContactOperation {
  contact: SendContactFn;
}

interface ContactFormProps {
  onSubmit: (options?: any) => void;
  sent?: boolean;
}

// tslint:disable-next-line:no-empty-interface
interface ContactProps extends ContactOperation {}

export { Contact };
export { SendContactFn };
export { ContactOperation, ContactProps, ContactState, ContactFormProps };
