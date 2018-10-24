import * as models from '../../../typings/graphql';

interface Context {
  mailer: any;
}

export default (): {
  Mutation: models.MutationResolvers.Resolvers<Context>;
} => ({
  Mutation: {
    async contact(_, { input }, { mailer }) {
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
