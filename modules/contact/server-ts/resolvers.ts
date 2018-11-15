import { validate, FieldError } from '@module/validation-common-react';
import { contactFormSchema } from './contactFormSchema';
import log from '../../../packages/common/log';

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
      const errors = new FieldError(validate(input, contactFormSchema));

      if (errors.hasAny()) {
        return { errors: errors.getErrors() };
      }

      try {
        await mailer.sendMail({
          from: input.email,
          to: process.env.EMAIL_USER,
          subject: 'New email through contact us page',
          html: `<p>${input.name} is sending the following message.</p><p>${input.content}</p>`
        });
      } catch (e) {
        log.error(e);
        return { errors: [{ field: 'serverError', message: t('contact:sendError') }] };
      }

      return { errors: null };
    }
  }
});
