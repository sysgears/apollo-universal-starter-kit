import * as Yup from 'yup';

import { formatYupError } from '../../../../common/utils';

const validateContactInput = (t: any) => {
  return Yup.object().shape({
    name: Yup.string()
      .min(3, t('contact:validation.name.min', { min: 3 }))
      .max(50, t('contact:validation.name.max', { max: 50 }))
      .required(t('contact:validation.required')),
    email: Yup.string()
      .email(t('contact:validation.email.invalid'))
      .required(t('contact:validation.required')),
    content: Yup.string()
      .min(2, t('contact:validation.content.min', { min: 2 }))
      .max(1000, t('contact:validation.content.min', { max: 1000 }))
      .required(t('contact:validation.required'))
  });
};

interface ContactInput {
  input: {
    name: string;
    email: string;
    content: string;
  };
}

export default () => ({
  Mutation: {
    async contact(obj: any, { input }: ContactInput, { mailer, req: { t } }: any) {
      try {
        await validateContactInput(t).validate(input, { abortEarly: false });
      } catch (e) {
        return { errors: formatYupError(e) };
      }

      await mailer.sendMail({
        from: input.email,
        to: process.env.EMAIL_USER,
        subject: 'New email through contact us page',
        html: `<p>${input.name} is sending the following message.</p><p>${input.content}</p>`
      });

      return { errors: null };
    }
  }
});
