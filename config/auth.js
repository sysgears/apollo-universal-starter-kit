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

    // [embedded, casbin, athenz]
    provider: 'embedded',

    // If no verbs, it will get all of them
    permissions: [
      {
        resource: 'admin',
        subresources: [
          'iam',
          'admin',
          'settings',
          'auth',
          'user',
          'group',
          'org',
          'serviceaccount',
          'subscription',
          'billing',
          'upload',
          'post'
        ],
        relations: ['superuser', 'admin', 'editor', 'user', 'viewer']
      },
      {
        resource: 'user',
        subresources: [
          'iam',
          'admin',
          'settings',
          'profile',
          'auth',
          'serviceaccount',
          'subscription',
          'billing',
          'upload',
          'post'
        ],
        relations: ['superuser', 'admin', 'editor', 'viewer', 'visitor', 'self']
      },

      {
        resource: 'org',
        subresources: ['iam', 'admin', 'settings', 'profile', 'members', 'subscription', 'billing', 'upload', 'post'],
        relations: ['superuser', 'owner', 'admin', 'member', 'viewer', 'visitor']
      },
      {
        resource: 'group',
        subresources: ['iam', 'admin', 'settings', 'profile', 'members', 'upload', 'post'],
        relations: ['superuser', 'owner', 'admin', 'member', 'viewer', 'visitor']
      },
      {
        resource: 'serviceaccount',
        subresources: ['iam', 'admin', 'settings', 'profile', 'auth', 'upload', 'post'],
        relations: ['superuser', 'owner', 'admin', 'viewer', 'self']
      },

      {
        resource: 'subscription',
        subresources: ['iam', 'admin', 'settings', 'plans', 'quotas'],
        relations: ['superuser', 'owner', 'admin', 'viewer']
      },
      {
        resource: 'upload',
        subresources: ['iam', 'admin', 'settings', 'meta', 'data', 'quotas'],
        relations: ['superuser', 'owner', 'admin', 'viewer']
      },
      {
        resource: 'post',
        subresources: ['iam', 'admin', 'settings', 'meta', 'content', 'comment'],
        relations: ['superuser', 'owner', 'admin', 'viewer']
      }
    ],

    verbs: ['create', 'update', 'delete', 'view', 'list'],

    userRoles: ['superuser', 'admin', 'subscriber', 'user', 'visitor'],
    groupRoles: ['owner', 'admin', 'member', 'viewer', 'visitor'],
    orgRoles: ['owner', 'admin', 'member', 'viewer', 'visitor'],

    // General format for scopes is:
    // resource:sub-resource:... / matching-object-relation / verb
    // This is to simplify the seeding and default permission specification
    // We won't be using wild-cards in the actual code for much longer
    userScopes: {
      superuser: ['*/superuser/*'],
      admin: [
        'admin*/admin/*',
        'user*/admin/*',
        'subscription*/admin/*',
        'org*/superuser/*',
        'group*/superuser/*',
        'serviceaccount*/superuser/*',
        'upload*/superuser/*',
        'post*/superuser/*'
      ],
      subscriber: ['subscription*/owner/*'],
      user: ['user*/self/*', 'user*/viewer/*', 'serviceaccount*/owner/*', 'upload*/owner/*', 'post*/owner/*'],
      visitor: ['*/visitor/*']
    },

    groupScopes: {
      owner: ['group*/owner/*'],
      admin: ['group*/admin/*'],
      member: ['group*/member/*'],
      viewer: ['group*/viewer/*'],
      visitor: ['group*/visitor/*']
    },

    orgScopes: {
      owner: ['org*/owner/*'],
      admin: ['org*/admin/*'],
      member: ['org*/member/*'],
      viewer: ['org*/viewer/*'],
      visitor: ['org*/visitor/*']
    }
  }
};
