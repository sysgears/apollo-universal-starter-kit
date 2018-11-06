import { email, minLength, required } from '../../../../common/modules/validation';

export const contactFormSchema = {
  name: [required, minLength(3)],
  email: [required, email],
  content: [required, minLength(10)]
};
