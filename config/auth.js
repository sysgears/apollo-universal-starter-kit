const CERTIFICATE_DEVSERIAL = '00';

export default {
  secret: process.env.AUTH_SECRET || 'dummy-application-secret',

  authentication: {
    enabled: true,
    loginSuccessRedirect: '/profile',

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
          enabled: false,
          clientID: process.env.FACEBOOK_CLIENTID,
          clientSecret: process.env.FACEBOOK_CLIENTSECRET,
          scope: ['email'],
          profileFields: ['id', 'emails', 'displayName']
        },
        google: {
          enabled: true,
          clientID: process.env.GOOGLE_CLIENTID,
          clientSecret: process.env.GOOGLE_CLIENTSECRET,
          scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
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

      orgRoles: ['owner', 'admin', 'member', 'viewer'],
      groupRoles: ['owner', 'admin', 'member', 'viewer'],
      userRoles: ['owner', 'admin', 'subscriber', 'user'],

      // General format for scopes is:
      // resource:sub-resource:... / matching-object-relation / verb
      userScopes: {
        owner: ['*/*/*'],
        admin: ['iam*/*/view', 'org*/*/*', 'group*/*/*', 'user*/*/*', 'subscription*/*/*', 'post*/*/*'],
        subscriber: ['subscription/owner/*'],
        user: [
          'user/self/*',
          'org/member/list',
          'org/member/view',
          'group/member/list',
          'group/member/view',
          'post/owner/*',
          'post:comment/owner/*',
          'post*/*/list',
          'post*/*/view'
        ]
      },
      groupScopes: {
        owner: ['group*/*/*'],
        admin: [
          'group:members/*/view*',
          'group:admin/self/*',
          'group:member/*/*',
          'group:viewer/*/*',
          'group:iam/*/view*'
        ],
        member: ['group:members/*/view*', 'group:member/self/*'],
        viewer: ['group:members/*/view*', 'group:viewer/self/*']
      },
      orgScopes: {
        owner: ['org*/*/*'],
        admin: ['org:group/*/*', 'org:admin/self/*', 'org:member/*/*', 'org:viewer/*/*', 'org:iam/*/view*', ''],
        member: ['org:group/*/view*', 'org:member/self/*'],
        viewer: ['org:group/*/view*', 'org:viewer/self/*']
      },
      verbs: ['create', 'update', 'delete', 'view', 'list']
    },
    rbac: {
      // [embedded, casbin, athenz]
      provider: 'embedded',

      roles: ['owner', 'admin', 'subscriber', 'user'],
      verbs: ['create', 'update', 'delete', 'view', 'view:all', 'watch', 'watch:all']
    }
  }
};
