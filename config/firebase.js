export default {
  enabled: false,
  sendConfirmationEmail: {
    enabled: false,
    secret: process.env.NODE_ENV === 'test' ? 'secret for tests' : process.env.AUTH_SECRET
  },
  jwt: {
    enabled: false
  },
  session: {
    enabled: false
  },
  facebook: {
    enabled: false,
    scope: 'email'
  },
  github: {
    enabled: false,
    scope: 'user:email'
  },
  google: {
    enabled: false,
    scope: 'https://www.googleapis.com/auth/userinfo.email'
  },
  config: {
    admin: {
      type: '',
      project_id: '',
      private_key_id: '',
      private_key: '',
      client_email: '',
      client_id: '',
      auth_uri: '',
      token_uri: '',
      auth_provider_x509_cert_url: '',
      client_x509_cert_url: ''
    },
    clientData: {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: ''
    }
  }
};
