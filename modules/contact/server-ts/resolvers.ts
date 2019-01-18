import { isEmpty } from 'lodash';
import { validate } from '@module/validation-common-react';
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
      // TODO if import ApolloError that get error 'app is not defined'
      const { ApolloError, UserInputError } = require('apollo-server-express');

      const errors = validate(input, contactFormSchema);
      if (!isEmpty(errors)) {
        throw new UserInputError(t('contact:validError'), { errors });
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
        throw new ApolloError(t('contact:sendError'), 'CONTACT_DENIED');
      }
    }
  }
});
