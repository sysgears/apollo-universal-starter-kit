export default {
  secret: process.env.NODE_ENV === 'test' ? 'secret for tests' : process.env.AUTH_SECRET,
  session: {
    enabled: true
  },
  jwt: {
    enabled: true,
    tokenExpiresIn: '1m',
    refreshTokenExpiresIn: '7d'
  },
  social: {
    github: {
      enabled: true,
      clientID: '62a26cd6ed51233d7072',
      clientSecret: '7f7374215bb85f37d705c316affa9a2d90ee0407',
      callbackURL: '/auth/github/callback',
      scope: ['user:email']
    }
  }
};
