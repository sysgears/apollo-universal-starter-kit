import { email, minLength, required } from '@module/validation-common-react';

export const contactFormSchema = {
  name: [required, minLength(3)],
  email: [required, email],
  content: [required, minLength(10)]
};
