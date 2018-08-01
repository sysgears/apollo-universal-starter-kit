interface ContactInput {
  input: {
    name: string;
    email: string;
    content: string;
  };
}

export default () => ({
  Mutation: {
    async contact(obj: any, { input }: ContactInput, context: any) {
      try {
        if (context.mailer) {
          context.mailer.sendMail({
            from: input.email,
            to: process.env.EMAIL_USER,
            subject: 'New email through contact us page',
            html: `<p>${input.name} is sending the following message.</p><p>${input.content}</p>`
          });
        }
        return true;
      } catch (e) {
        return true;
      }
    }
  }
});
