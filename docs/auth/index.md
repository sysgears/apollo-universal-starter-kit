# Auth docs

The authentication (authN) and authortization (authZ) system
is a configurable set of permissions, roles, bindings,
and validation injection.
AuthN is the process of verifying someone is who they say they are.
AuthZ is the process of verifying this person can do the thing they are asking to do.

Generally, Json Web Tokens (JWT) is used for authentication,
once a person has logged into the application.

### Auth Flow

Client side:

1. Login
1. Get token
1. Use the app
  1. token is put into the header of all requests to the server.
  1. encoded token information is used to dynamically render components,
     control routing, and short-circuit requests which would otherwise fail for permissions.
     
Server side:

1. Successful login request
  1. Generate token
    1. Gather user information
    1. Generate token
  1. Send token in response headers
1. Request with header
  1. Verify token (can fallback on apikeys and certs)
  1. Lookup user and roles on each request
  1. Add auth information to the context
  1. Resolvers will now have a `context.auth` object


### The JWT token

The JWT consists of three pieces of information.

- `id`: the user ID
- `email`: the primary email of the user
- `roles`: the roles and permssions object

The JWT token is signed with a combination of the application `SECRET`
and the hashed user password. 
With this method, we can 

- verify the token server-side
- keep each token secret unique to the user
- decode the token for client-side decisions\*

\* while the roles can be spoofed on the client side,
any components that get loaded will not get data.
(assuming the server-side authZ is correct.)

The token is:

- passed with headers `x-token` and `x-refresh-token`
- stored in cookies with the same name client side
- used mainly in routing on the client, decoding the cookie on each location change.
- used only for user ID on the server

Usage: 

We store the entire user role structure in the cookie,
and this could seem bad. However the role information
is only provided for a better client-side experience.

On the server, during a request, the token is
verified and the user ID is extracted.
The ID is then used to lookup all subsequent roles and permissions for the user.

On the client, each route change decodes the cookie.

The token has a default `1m` expiriation.
With each token refresh,
the role structure is refreshed as well.

This should make authZ updates happen quickly.

It is TBD if this is excessive yet,
with client or server side.


### Permission Scheme

The permission scheme consists of three components:

1. Resource:subresource:on-and-on
1. Relation
1. Verb

Verbs are: [create, update, delete, view, list]

Relations are dependent upon the resource.

Resources are objects in your application,
along with some defaults depending on the modules.

All three are configuable, the defaults are in the `config/auth.js` file.

Their form is: `resource:subresource/relation/verb`.
With the underlying matching algorithm doint sting matching,
you are free to devise different permission schemes.
There is also a regex validator available,
but it is not recommended to do security with wild cards.

Example:

```
permissions: [
  {
    resource: 'admin',
    subresources: ['iam', 'admin', 'settings', 'auth', 'user', 'group', 'org', 'serviceaccount', 'subscription', 'billing', 'upload', 'post'],
    relations: ['superuser', 'admin', 'editor', 'user', 'viewer']
  },
  {
    resource: 'user',
    subresources: ['iam', 'admin', 'settings','profile', 'auth', 'serviceaccount', 'subscription', 'billing', 'upload', 'post'],
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
```

### Entities and Roles

Within the system, there are several entities:

1. Users
1. Groups
1. Organizations

Each has their own set of roles.

- With users, the roles are application wide.
- With groups and orgs, the roles are localized.

With the many-to-many user memberships in groups and orgs,
and the `authSwitch` described below,
you have flexibility in how you
configure authZ, scope requests, and filter responses.


Talk about how the binding happens here...



### Verification in the client and server

Utility functions are provided
to simplify the verification and its implementation in the code.
Both uses the same permissions and matching function
to ensure consistency. They both also have three inputs: (??? need to work on the client side again soon...)

1. requiredScopes: [ an array of scopes ] / [ special "deny" or "skip" values ] / a function which returns either of the previous
1. presentedScopes: [ an array of scopes ] / [ special "deny" or "skip" values ] / a function which returns either of the previous
1. callback: [ a function to execute on successful authZ ] / [special "next" token which means successful authZ, but the next guy should do the work]

The actual verification function today is,
with some short circuits for the special tokens and scenarios:

(from `src/common/auth/validate.js`)

```
export function validateScope(required, provided) {
  if (!provided) {
    return false;
  }
  if ( required && required === 'deny' || required === 'skip') {
    return required
  }
  if ( required && required.length === 1  && (required[0] === 'deny' || required[0] === 'skip')) {
    return required[0]
  }

  if (!required || required.length == 0) {
    return true;
  }

  return validateScope_v2(required, provided);
}

export function validateScope_v2(required, provided) {
  // erm, sort at leas the provided, then bin search provided
  // required is not likely worth it, but provided definitely will need it
  // work should be started, and they may be sorted at this point.
  // haven't checked
  for (let scope of required) {
    for (let perm of provided) {
      if ( scope === perm ) {
        return `${perm} >> ${scope}`;
      }
    };
  };

  return false;
}
```



#### Server-side `authSwitch`

In: `src/common/auth/server.js`

```
authSwitch([
  {
    requiredScopes: ...,
    presentedScopes: ...,
    callback: ...
  }
])
```

The server-side `authSwitch` functions all have the same signature:

`function( sources, args, context, info )`

- `sources` is the 'obj' from graphql or 'source' from `graphql-resolve-batch`
- `args` are the arguments to the graphql query,mutation, resolver, etc.
- `context` is the graphql context (This is where the `auth` object is and has the module additions and the request object too)
- `info` is information about the graphql schema and request. The `info.path` object is used
  to help scope and filter requests based on authorization.


#### Client-side `checkAuth`

In: `src/common/auth/client.js`


This function is wrapped in some
`AuthRoute` magic for typical usage
in client modules.
You can use it generally in the client
to ask about rendering a component or not,
or deciding which graphql call to make,
among the many possibilities.

#### Client-side `AuthRoute` and `AuthMultiRoute`

React components which wrap Route with
a cookie provider and the checkAuth


### Configuration


see the `config/auth.js` file for now
