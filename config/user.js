export default {
  secret: `${process.env.AUTH_SECRET}`,
  confirm: true,
  sendConfirmationEmail: true,
  auth: {
    password: true,
    certificate: false
  }
};
