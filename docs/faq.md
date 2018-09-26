## How do I create a kit-based project without forking on GitHub and still be able to receive updates?
You should init a new git repo, then add the kit as a remote upstream repository, then do `git merge upstream/stable` when you are in `master` branch of your project:

https://help.github.com/articles/syncing-a-fork/

Whenever you want to receive updates - do `git fetch upstream` and then `git merge upstream/stable` when you are in `master` branch of your project.

## How do I specify a custom GraphQL backend?

Specify the URL in `.spinrc.js` -> `__BACKEND_URL__`

You will still need to run the backend provided by the kit, it will do server side rendering for you.
If you don't want to use kit's backend at all - turn off server side rendering set `.spinrc.js` -> `options` -> `ssr` to `false`

Reference: [#585](https://github.com/sysgears/apollo-universal-starter-kit/issues/585)

## How do I add a different Database?

This will depend a lot on the way your database handles connections. Automatically almost all databases that use SQL are supported via Knex (Postgres, MSSQL, MySQL, MariaDB, SQLite3, and Oracle).

As Victor Vlasenko told - this kit is database-agnostic. Other types you can add if they support a JS client. This way you can create a simple connector and export it normally in place of the Knex connector.

Reference: [#525](https://github.com/sysgears/apollo-universal-starter-kit/issues/525)

## How do I enable Facebook and Google OAuth for logins?

Enable the features in config/user.js

## How do I set up environment variables for development work?

Add them to packages/server/.env

## How to add a support for a custom domain name in the local dev environment?

First, modify the host file in the following way:

`127.0.0.1    localhost.host`

Then, add this setting into `/packages/client/.sprinjs` file under `options` section

```
webpackConfig: {
      devServer: {
        public: 'localhost.host'
      }
    }
```
## What are different extensions `.web.js`, `.native.js` in source filenames used for?

The starter kit uses Webpack to build the code for each of the platforms: `server`, `web`, `android`, `ios`. It uses [`resolve.extensions`](https://webpack.js.org/configuration/resolve/#resolve-extensions) Webpack property to figure out which file should be used while generating platform bundle in case if there are many files with the same name but different extensions, for example `storage.js`, `storage.native.jsx`, `storage.web.jsx`. 

The `resolve.extensions` value for each platform is:

|Platform|`resolve.extensions`|
|--------|--------------------|
|server|`.web.tsx`, `.web.jsx`, `.web.ts`, `.web.js`, `.tsx`, `.jsx`, `.ts`, `.js`, `.json`|
|web|`.web.tsx`, `.web.jsx`, `.web.ts`, `.web.js`, `.tsx`, `.jsx`, `.ts`, `.js`, `.json`|
|ios|`.ios.tsx`, `.ios.jsx`, `.ios.ts`, `.ios.js`, `.native.tsx`, `.native.jsx`, `.native.ts`, `.native.js`, `.tsx`, `.jsx`, `.ts`, `.js`, `.json`|
|android|`.android.tsx`, `.android.jsx`, `.android.ts`, `.android.js`, `.native.tsx`, `.native.jsx`, `.native.ts`, `.native.js`, `.tsx`, `.jsx`, `.ts`, `.js`, `.json`|

## Keeping your project up to date with latest changes
Best way of keeping your project up to date is to configure a remote that points to the upstream of this repository. (https://help.github.com/articles/configuring-a-remote-for-a-fork/) That way you can easily pull in latest changes made to this kit. (https://help.github.com/articles/syncing-a-fork/)

If you intend to make significant changes to existing modules, we suggest you copy and rename the modules, to limit the amount of merge conflicts to a minimum.