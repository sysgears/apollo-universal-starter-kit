# Frequently Asked Questions about Apollo Universal Starter Kit 

In this section, you'll find answers on the following frequently asked questions:

* [How do I update my Apollo Universal Starter Kit project without forking the repository?](#how-do-i-update-my-apollo-universal-starter-kit-project-without-forking-the-repository)
* [How do I use a custom GraphQL backend?](#how-do-i-use-a-custom-graphql-back-end)
* [How do I use a different database?](#how-do-i-use-a-different-database-instead-of-sqlite)
* [How do I enable Facebook and Google OAuth?](#how-do-i-enable-facebook-and-google-oauth)
* [How do I set up environment variables for development?](#how-do-i-set-up-environment-variables-for-development)
* [How do I add support for a custom domain name in the local development environment?](#how-do-i-add-support-for-a-custom-domain-name-in-the-local-development-environment)
* [What extensions can I use when creating files in my project?](#what-extensions-can-i-use-when-creating-files-in-my-project)
* [How do I always keep my Apollo Starter Kit project up-to-date?](#how-do-i-always-keep-my-apollo-starter-kit-project-up-to-date)

## How do I update my Apollo Universal Starter Kit project without forking the repository?

Follow the steps below to create an Apollo Starter Kit project and updating the fork:

1. Initialize a new Git repository
2. Add the starter kit as a remote upstream repository:
3. Run the following command:

```bash
git merge upstream/stable
```

4. When you are in `master` branch of your project:

https://help.github.com/articles/syncing-a-fork/

Whenever you want to receive updates, first run:

```bash
git fetch upstream
``` 

Then run when you are in the master branch of your project:
```bash 
git merge upstream/stable
```

## How do I use a custom GraphQL back end?

To set your custom GraphQL back end endpoint, change the URL in `packages/server/.zenrc.js` for the 
`config.options.define.__API_URL__` property:

```javascript
const url = require('url');

const config = {
  // code is omitted
  options: {
    // other options are omitted
    defines: {
      __DEV__: process.env.NODE_ENV !== 'production',
      __SERVER_PORT__: 8080,
      __API_URL__: '"/graphql"', // set the full URL to the external GraphQL API e.g. https://example.com/graphql
      __WEBSITE_URL__: '"http://localhost:3000"'
    }
  }
};
```

We recommend that you still run the back-end code provided by the starter kit to use the server-side rendering (SSR).
You can also turn off SSR if you don't use the starter kit back end. Set the `config.options.ssr` to `false` in 
`packages/server/.zenrc.js`:

```javascript
const url = require('url');

const config = {
  // other code is omitted
  options: {
    // other options are omitted
    ssr: true // set to false if you don't need Apollo Starter Kit back end
  }
};
```

Reference: [#585](https://github.com/sysgears/apollo-universal-starter-kit/issues/585)

## How do I disable Server Side Rendering?

To disable Server Side Rendering (SSR), change a dedicated SpinJS setting in `.zenrc.js` files:

* For the Express application, set `config.options.ssr` to `false` in `packages/server/.zenrc.js`
* For the React application, set `config.options.ssr` to `false` in `packages/client/.zenrc.js`

**NOTE**: If you're going to disable SSR, you must disable it in **both** packages &ndash; `server` and `client`!

Disabling SSR in the `server` package:

```js
// File packages/server/.zenrc.js

const config = {
  builders: {
    // ...
    stack: ['server'],
  },
  options: {
    // SSR is now disabled for server
    // Remember to disable SSR for the client in package/client/.sprinrc.js
    ssr: false,
    // ...
  }
};
// ...
```

Similarly, you can turn off SSR in the `client` package:

```js
// File packages/client/.zenrc.js

const config = {
  builders: {
    web: {
      // ...
      stack: ['web'],
    },
  },
  options: {
    // SSR is now disabled for client
    // Remember to disable SSR for the server in package/server/.zenrc.js
    ssr: false,
  }
};
```

More information: [Server Side Rendering with Apollo Universal Starter Kit].

## How do I use a different database instead of SQLite?

You can almost all relational database management systems that use SQL and are supported by [Knex] such as PostgreSQL, 
MySQL, MSSQL, MariaDB, SQLite3, and Oracle.

Apollo Universal Starter Kit is database-agnostic. You can any other databases if they support a JavaScript client 
provided by Knex. This way you can create a simple connector and export it normally in place of the Knex connector.

Reference: [#525](https://github.com/sysgears/apollo-universal-starter-kit/issues/525)

## How do I enable Facebook and Google OAuth?

You can enable the social login functionality in the `config/user.js` file:

```javascript
export default {
  // other configurations are omitted
  auth: {
    facebook: {
          enabled: false, // set to true to enable login with Facebook
          clientID: process.env.FACEBOOK_CLIENTID,
          clientSecret: process.env.FACEBOOK_CLIENTSECRET,
          scope: ['email'],
          profileFields: ['id', 'emails', 'displayName']
    },
    github: {
      enabled: false, // set to true to enable login with GitHub
      clientID: process.env.GITHUB_CLIENTID,
      clientSecret: process.env.GITHUB_CLIENTSECRET,
      scope: ['user:email']
    },
    linkedin: {
      enabled: false, // set to true to enable login with LinkedIn
      clientID: process.env.LINKEDIN_CLIENTID,
      clientSecret: process.env.LINKEDIN_CLIENTSECRET,
      scope: ['r_emailaddress', 'r_basicprofile']
    },
    google: {
      enabled: false, // set to true to enable login with Google
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    }
  }
};
```
 
## How do I add support for a custom domain name in the local development environment?

First, modify the host file in the following way:

`127.0.0.1 localhost.host`

Then, add this setting into `/packages/client/.sprinjs` file under `options` section

```
webpackConfig: {
  devServer: {
    public: 'localhost.host'
  }
}
```

## What extensions can I use when creating files in my project?

Apollo Universal Starter Kit suggests that you use the following extensions when creating your modules:

| Platform | Directory        | Possible extensions for application files |
| -------- | ---------------- | ----------------------------------------- |
| server   | packages/server/ | `.tsx`, `.jsx`, `.ts`, `.js`, `.json`     |
| web      | packages/client/ | `.tsx`, `.jsx`, `.ts`, `.js`, `.json`     |

When you develop a native mobile app, we also recommend that you follow the naming convention below:

| Platform | Directory        | Possible extensions for application files                             |
| -------- | ---------------- | --------------------------------------------------------------------- |
| native   | packages/mobile/ | `.native.tsx`, `.native.jsx`, `.native.ts`, `.native.js`, `.json`     |
| android  | packages/mobile/ | `.android.tsx`, `.android.jsx`, `.android.ts`, `.android.js`, `.json` |
| ios      | packages/mobile/ | `.ios.tsx`, `.ios.jsx`, `.ios.ts`, `.ios.js`, `.json`                 |

Notice that you should use the `.native.tsx` and similar extensions for files with the same logic for both Android and
iOS platforms. If the logic for these two platforms is different, use `.android.tsx` (and similar extensions) for  
Android, and `.ios.tsx` for iOS.

For example, here's how the files may be called for the Storage module:
 
* `storage.tsx` for the web and server platforms
* `storage.native.tsx` for the mobile app for files with the same logic
* `storage.android.tsx` for the custom logic for the Android platform
* `storage.ios.tsx` for the custom logic for the iOS platform  

Apollo Universal Starter Kit uses Webpack to build the code for all the platforms &ndash; server, web, Android, and iOS. 
The starter kit uses the [`resolve.extensions`] Webpack property to understand which files should be used for generating 
a specific platform bundle when there are several files with the same name but different extensions.

## How do I always keep my Apollo Starter Kit project up-to-date?

The best way for keeping your Apollo Universal Starter Kit project always up-to-date is to configure a remote repository
that points to the upstream of the original repository. 

You can consult [Configuring a Remote for a Fork] documentation on GitHub. Using this feature, you can easily pull in 
the latest changes made to this kit. For that, consult the [Syncing a Fork].

If you intend to make significant changes to existing modules, we suggest you copy and rename the modules, to limit the 
amount of merge conflicts to a minimum.

[knex]: https://knexjs.org/
[`resolve.extensions`]: https://webpack.js.org/configuration/resolve/#resolve-extensions
[server side rendering with apollo universal starter kit]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/docs/configuration.md#server-side-rendering
[configuring a remote for a fork]: https://help.github.com/articles/configuring-a-remote-for-a-fork/
[syncing a fork]: https://help.github.com/articles/syncing-a-fork/
