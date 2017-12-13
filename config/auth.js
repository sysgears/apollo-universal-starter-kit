const CERTIFICATE_DEVSERIAL = '00';

export default {
  secret: process.env.AUTH_SECRET || 'dummy-application-secret',

  authentication: {
    enabled: true,
    // [embedded, dex]
    provider: 'embedded',

    password: {
      enabled: true,
      confirm: true,
      sendConfirmationEmail: true,
      sendAddNewUserEmail: true
    },

    passwordless: {
      enabled: false,
      confirm: true,
      sendConfirmationEmail: true,
      sendAddNewUserEmail: true
    },

    apikey: {
      enabled: true
    },

    certificate: {
      enabled: true,
      devSerial: CERTIFICATE_DEVSERIAL
    },

    oauth: {
      enabled: true,
      providers: {
        facebook: {
          enable: false,
          clientID: process.env.FACEBOOK_CLIENTID,
          clientSecret: process.env.FACEBOOK_CLIENTSECRET
        },
        google: {
          enable: true,
          clientID: process.env.GOOGLE_CLIENTID,
          clientSecret: process.env.GOOGLE_CLIENTSECRET
        }
      }
    }
  },

  authorization: {
    enabled: true,
    method: 'basic',

    basic: {
      // [embedded, casbin, athenz]
      provider: 'embedded',

      roles: ['owner', 'admin', 'subscriber', 'user'],
      subjects: {
        users: true
      },
      verbs: ['create', 'update', 'delete', 'view', 'view:all']
    },
    rbac: {
      // [embedded, casbin, athenz]
      provider: 'embedded',

      roles: ['owner', 'admin', 'subscriber', 'user'],
      verbs: ['create', 'update', 'delete', 'view', 'view:all', 'watch', 'watch:all']
    }
  }
};
