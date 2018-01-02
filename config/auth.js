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
    //
    // If no verbs, it will get all of them
    permissions: [
      {
        resource: 'admin:app',
        subresources: ['about', 'settings', 'reports', 'reports:[iam,settings,dashboards,jobs]']
      },
      {
        resource: '[admin:,admin:app:,]user',
        subresources: [
          'self',
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
        ]
      },

      {
        resource: '[admin:,admin:app:,]org',
        subresources: [
          'iam',
          'admin',
          'settings',
          'profile',
          'members[,:self,:iam]',
          'groups',
          'subscription',
          'billing',
          'upload',
          'post'
        ]
      },
      {
        resource: '[admin:,admin:app:,]group',
        subresources: ['iam', 'admin', 'settings', 'profile', 'members[,:self,:iam]', 'upload', 'post']
      },

      {
        resource: '[admin:,admin:app:,]serviceaccount',
        subresources: ['iam', 'admin', 'settings', 'profile', 'auth', 'upload']
      },
      {
        resource: '[admin:,admin:app:,]subscription',
        subresources: ['iam', 'admin', 'settings', 'plans', 'quotas', 'usage']
      },

      {
        resource: '[admin:,admin:app:,]upload',
        subresources: ['iam', 'admin', 'settings', 'meta', 'data', 'quotas', 'usage']
      },
      {
        resource: '[admin:,admin:app:,]post',
        subresources: ['iam', 'admin', 'settings', 'meta', 'content', 'comment']
      }
    ],

    verbs: ['create', 'update', 'delete', 'view', 'list'],

    userRoles: ['superuser', 'admin', 'subscriber', 'user'],
    groupRoles: ['owner', 'admin', 'member'],
    orgRoles: ['owner', 'admin', 'member'],

    // General format for scopes is:
    // resource:sub-resource:... / matching-object-relation / verb
    // This is to simplify the seeding and default permission specification
    // We won't be using wild-cards in the actual code for much longer
    userScopes: {
      superuser: ['admin:*/*'],
      admin: ['admin:[user,group,org,serviceaccount,profile,upload,post]*/*'],
      subscriber: ['subscription:*/*'],
      user: ['user:*/*', 'user/[list,view]', 'group/[list,view,create]', 'org/[list,view,create]']
    },

    groupScopes: {
      owner: ['group*/*'],
      admin: ['group:iam*/[list,view]', 'group:[admin,settings,profile,members,upload,post]*/*'],
      member: ['group:members:self*/*', 'group:[settings,profile,members,upload,post]/[view,list]']
    },

    orgScopes: {
      owner: ['org*/*'],
      admin: ['org:iam*/[list,view]', 'org:[admin,settings,groups,profile,members,upload,post]*/*'],
      member: ['org:members:self*/*', 'org:[settings,profile,groups,members,upload,post]/[view,list]']
    }
  }
};
