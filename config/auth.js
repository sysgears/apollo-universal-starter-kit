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
        resource: 'org',
        subresources: ['iam', 'profile', 'group', 'user', 'serviceaccount', 'post'],
        relations: ['owner', 'admin', 'member', 'viewer']
      },
      {
        resource: 'group',
        subresources: ['iam', 'profile', 'user', 'serviceaccount', 'post'],
        relations: ['owner', 'admin', 'member', 'viewer']
      },
      {
        resource: 'user',
        subresources: ['iam', 'profile', 'auth', 'serviceaccount', 'post', 'comment'],
        relations: ['self', 'all', 'other']
      },
      {
        resource: 'serviceaccount',
        subresources: ['iam', 'profile', 'auth'],
        relations: ['self', 'all', 'other', 'owner']
      },
      {
        resource: 'subscriber',
        subresources: ['billing', 'plans'],
        relations: ['owner', 'admin', 'all', 'viewer']
      },
      {
        resource: 'post',
        subresources: ['comment'],
        relations: ['owner', 'all', 'viewer']
      },
      {
        resource: 'comment',
        relations: ['owner', 'all', 'viewer']
      }
    ],

    orgRoles: ['owner', 'admin', 'member', 'subscriber', 'user', 'viewer'],
    groupRoles: ['owner', 'admin', 'member', 'viewer'],
    userRoles: ['superuser', 'admin', 'subscriber', 'user', 'visitor'],
    saRoles: ['admin', 'subscriber', 'user', 'visitor'],

    // General format for scopes is:
    // resource:sub-resource:... / matching-object-relation / verb
    // This is to simplify the seeding and default permission specification
    // We won't be using wild-cards in the actual code for much longer
    userScopes: {
      superuser: ['*/*/*'],
      owner: ['*/*/*'],
      admin: ['*:iam/*/view', 'org*/*/*', 'group*/*/*', 'user*/*/*', 'subscriber*/*/*', 'post*/*/*'],
      subscriber: ['subscriber/owner/*'],
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
      ],
      visitor: ['org*/viewer/*', 'group*/viewer/*', 'post*/viewer/list', 'post*/*/view']
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
  }
};
