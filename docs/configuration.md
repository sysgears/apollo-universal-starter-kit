# Configuring Apollo Universal Starter Kit

This section contains information about Apollo Universal Starter Kit configurations. Follow to the configuration 
sections you're interested in by clicking the links below:

* [General Info about Application Settings](#general-information)
* [Global Application Settings](#global-application-settings)
* [Configuring Apollo Universal Starter Kit with SpinJS](#configuring-apollo-universal-starter-kit-with-spinjs)
* [UI Libraries](#built-in-ui-libraries)
* [Engine](#apollo-engine)
* [Internationalization](#internationalization)
* [Mailer](#mailer)
* [Mobile Chat](#mobile-chat)
* [Pagination](#pagination)
* [Stripe Subscription](#stripe-subscription)
* [Upload Module](#upload-module)
* [User Authentication](#user-authentication)

## General Information

Apollo Universal Starter Kit root configuration file is called `setting.js`, and it imports all `config/*.js` files. 
Various starter kit modules import the `settings.js` file to get the necessary configuration values from `config/*.js`.

The flow looks similar to this: 

```
config/*.js => settings.js => actualApplicationFil.js
```

For example, the `packages/server/src/modules/user/auth/facebook/index.js` file imports `settings.js` to get access to 
the `config/user.js` properties to use social authentication with Facebook.

```js
// Other imports are omitted
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';

import settings from '../../../../../../../settings'; // Imported configurations from the root setting.js

let middleware;

if (settings.user.auth.facebook.enabled && !__TEST__) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: settings.user.auth.facebook.clientID,
        clientSecret: settings.user.auth.facebook.clientSecret,
        callbackURL: settings.user.auth.facebook.callbackUrl,
        scope: settings.user.auth.facebook.scope,
        profileFields: settings.user.auth.facebook.profileFields
      },
// Other code is omitted
```

## Global Application Settings

The global application settings are located in the `config/app.js` file.

| Option              | Type    | Description                                                                    |
| ------------------- | ------- | ------------------------------------------------------------------------------ |
| name                | String  | The project name. Defaults to 'Apollo Starter Kit'                             |
| ------------------- | ------- | ------------------------------------------------------------------------------ |
| logging             | Object  | Contains the `level`, `debugSQL`, and `apolloLogging` logging properties       |
| level               | String  | Sets the logging level to `debug` for development and `info` for production    |
| debugSQL            | Boolean | Prints the SQL commands that are executed on the back end. Defaults to `false` |
| apolloLogging       | Boolean | Logs all Apollo operations in the development environment. Defaults to `false` |
| ------------------- | ------- | ------------------------------------------------------------------------------ |
| stackFragmentFormat | String  | Special URL setting for Visual Studio Code IDE                                 |

You can learn more about the last setting, `stackFragmentFormat`, in the following documents:

* Consult [Opening VS Code with URLs] for Windows and MacOS
* Consult [Visual Studio Code URL Handler] for Linux

## Configuring Apollo Universal Starter Kit with SpinJS 

Apollo Universal Starter Kit uses [SpinJS], a custom JavaScript library, to configure and build the web, server, and 
mobile applications with webpack.

You can change the SpinJS configurations in the `.spinrc.js` files that are located in the following starter kit
packages:

* `packages/client/.spinrc.js` contains SpinJS settings for the client-side application
* `packages/server/.spinrc.js` contains SpinJS settings for the server-side application
* `packages/mobile/.spinrc.js` contains SpinJS settings for the React Native mobile app

Consult the [SpinJS documentation] for more information on how you can configure SpinJS for your Apollo Universal 
Starter Kit project.

## Built-In UI Libraries

Apollo Universal Starter Kit uses [Twitter Bootstrap] to help you quickly add generic styles to the client application. 
Besides Twitter Bootstrap, the starter kit also integrates [Ant Design] for the web application.

For the React Native mobile app, you can use [Ant Design Mobile] or [NativeBase].

By default, Apollo Universal Starter Kit uses Twitter Bootstrap for the client application and NativeBase for the mobile
app. You can enable the alternatives this way: 

* To use Ant Design instead of Twitter Bootstrap, uncomment the respective import for Ant Design and comment out the 
import for Bootstrap in the `packages/client/src/modules/common/components/web/index.jsx` file: 

```javascript
// export * from './ui-bootstrap';
export * from './ui-antd';
```

* To use Ant Design Mobile instead of NativeBase, uncomment the Ant Design Mobile export and comment out the NativeBase
export in the `packages/client/src/modules/common/components/native/index.jsx` file:

```javascript
// export * from './ui-native-base';
export * from './ui-antd-mobile';
```

## Database

Apollo Universal Starter Kit supports SQL databases such as PostgreSQL, MySQL, and SQLite (used by default). The 
database configurations are located in the `config/db.js` file.

To be able to use PostgreSQL or MySQL, you only need to add necessary environment variables to the 
`packages/server/.env` file:

* `DB_HOST`, use `localhost` for development mode
* `DB_USER`, database username
* `DB_PASSWORD`, database password
* `DB_DATABASE`, the database to which the application will connect
* `DB_SOCKET_PATH`, the socket path 
* `DB_SSL`, use the SSL certificate to connect with SSL

To set the correct values for the listed variables, consult the following documentation:

* [Connection URIs] for PostgreSQL
* [Connecting using a URI String] for MySQL
* [MySQL socket path]
* [PostgreSQL socket path]

## Apollo Engine

Apollo Universal Starter Kit uses [Apollo Engine]. The Engine configurations are stored in the `config/engine.js` file. 

| Setting | Type   | Definition                                                                                |
| ------- | ------ | ----------------------------------------------------------------------------------------- |
| apiKey  | String | Sets the [Engine API key]                                                                 |
| ------- | ------ | ----------------------------------------------------------------------------------------- |
| logging | Object | Holds the Engine properties such as the logging level                                     |
| level   | String | Sets the logging level for Apollo Engine. Use `'DEBUG'`, `'INFO'`, `'WARN'`, or `'ERROR'` |

## Internationalization

The internationalization configurations are stored in the `config/i18n.js` file. Apollo Universal Starter Kit uses the
i18next library to implement internationalization.

Consult the table below for the configuration details:

| Setting            | Type          | Definition                                                              |
| ------------------ | ------------- | ----------------------------------------------------------------------- |
| enabled            | Boolean       | Enables the i18n module for the client, server, and mobile applications |
| langPickerRender   | Boolean       | Enables the select component on the HTML page                           |
| langList           | Array<String> | Sets the list of supported languages                                    |
| fallbackLng        | Object        | Sets the default language for the application                           |
| cookie             | String        | Sets the name for the cookie that will store the language               |

**NOTE**: The `fallbackLng` and `langList` properties are used by i18next. Consult [i18next documentation] for 
more information. The `cookie` property is used by the [i18next-express-middleware].

## Mailer

Apollo Universal Starter Kit uses Nodemailer to provide emailing functionality. The mailer configurations are stored in 
the `config/mailer.js` file. 

The mailer module (located in `packages/server/src/modules/mailer`) requires these data:

| Setting | Type   | Description                                              |
| ------- | ------ | -------------------------------------------------------- |
| host    | String | Sets the email host. Defaults to `smtp.ethereal.email`   |
| port    | Number | Sets the email host port                                 |
| auth    | Object | Contains the `user` and `pass` authentication properties |
| user    | String | Sets the user emails address                             |
| pass    | String | Sets the password for authenticating the requests        |

Consult Nodemailer [general options] and [authentication] documentation for more information about the required data.

You need to provide the values for `host`, `port`, `user`, and `pass` in the `packages/server/.env` file. The following
extract from the `.env` uses the default values. You need to change them when using mailer for production.

```dotenv
# Email
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=olgv7abv3lcmipb7@ethereal.email
EMAIL_PASSWORD=VTKxTbK7RPFNBjQwp9
```

## Mobile Chat

To configure the mobile chat module, follow to the section below:

* [`docs/modules/mobileChat.md`]

## Pagination

Apollo Universal Starter Kit implements the relay- and cursor-based pagination types:

* The relay pagination provides the **Load More** button. By clicking **Load More**, you tell the application to load a 
number of new items asynchronously and show them _in the same page_.

* The standard pagination is cursor-based: the items are shown page by page, and you need to navigate between pages to 
see items. You can learn more about the cursor-based pagination in the [dedicated Apollo blog post].

You can change the pagination settings in the `config/pagination.js` file. Apollo Universal Starter Kit lets you 
configure pagination for the web application and for the mobile app separately, meaning you can use different pagination 
types for the web and mobile applications. 

| Pagination Setting | Type   | Definition                                                                                   |
| ------------------ | ------ | -------------------------------------------------------------------------------------------- |
| web                | Object | Contains the `itemsNumber` and `type` pagination properties for the web application          |
| itemsNumber        | Number | Sets the number of shown items per page. Defaults to `10`                                    |
| type               | String | Sets the `'relay'` or `'standard'` pagination for the web application. Defaults to `'relay'` |
| mobile             | Object | Contains the `itemsNumber` and `type` pagination properties for the mobile app               |
| itemsNumber        | Number | Sets the number of shown items per page. Defaults to `10`                                    |
| type               | String | Sets the `'relay'` or `'standard'` pagination for the mobile app. Defaults to `'relay'`      |

## Stripe Subscription

To configure Stripe subscription, follow to the section below:

* [`docs/modules/stripeSubscription.md`]

## Upload Module

Currently, you can only change the folder for the uploaded files in the upload module in Apollo Universal Starter Kit. 

The upload module configuration is located in the `config/upload.js` file. The configuration below will set the
folder for uploaded files to `packages/server/public`:

```js
// Upload directory is packages/server/public/
// The path is resolved from the packages/server directory
export default {
  uploadDir: 'public'
};
```

The path to the `uploadDir` is resolved from `apollo-universal-starter-kit/packages/server`. If you set the `uploadDir` 
property to `uploads`, the uploaded files will be located under `packages/server/uploads`. 

The upload directory is generated automatically when you upload a file to the server.

## User Authentication

You can configure authentication for your Apollo Universal Starter Kit-based application in the `config/user.js` file.

### `secret`

Sets `AUTH_SECRET` for development and production modes. 

`AUTH_SECRET` is the secret string used for signing the authentication tokens on the server if user sessions are 
controlled by JWT. If you're using the session-based authentication, `AUTH_SECRET` is used to validate the secret 
encryption key and private key for sessions.

You need to add the `AUTH_SECRET` string into the `packages/server/.env` file. Find the following line and add your 
secret string (typically, an alphanumeric sequence of random characters) instead of `"secret"`:

```dotenv
# Auth
AUTH_SECRET=secret, change for production
```

### `auth`

Contains authentication properties such as the type of authentication, the password and certificate details, as well as 
the social authentication properties for Facebook, GitHub, LinkedIn, and Google.

#### `access`

Configures the authentication methods. By default, Apollo Universal Starter Kit uses both JSON Web Token and 
session-based authentication mechanisms. 

| Value                 | Type    | Description                                                                  |
| --------------------- | ------- | ---------------------------------------------------------------------------- |
| session               | Object  | Contains the global properties for the server session-based authentication   |
| enabled               | Boolean | Enables sessions for authentication. Defaults to `true`                      |
| jwt                   | Object  | Contains the global properties for the JWT-based authentication              |
| enabled               | Boolean | Enables JWT for authentication. Defaults to `true`                           |
| tokenExpiresIn        | String  | Sets the expiration period for the authentication token. Defaults to `'1m'`  |
| refreshTokenExpiresIn | String  | Sets the expiration period for the refresh token. Defaults to `'7d'`         |

Usage example:

```js
export default {
  auth: {
    access: {
      session: {
        enabled: true
      },
      jwt: {
        enabled: true,
        tokenExpiresIn: '1m',
        refreshTokenExpiresIn: '7d'
      }
    }
  }
}
```

#### `password`

Configures the password validation and other settings for the server-side and client-side validation. 

| password              | Object  | Contains the global properties for the `password` configurations         |
| --------------------- | ------- | ------------------------------------------------------------------------ |
| confirm               | Boolean | Requires password confirmation for validation. Defaults to `true`        |
| sendConfirmationEmail | Boolean | Sends the confirmation email after the user changes their password       |
| sendAddNewUserEmail   | Boolean | Requires password confirmation for validation. Defaults to `true`        |
| minLength             | Number  | Sets the minimal password length for validation. Defaults to `8`         |
| enabled               | Boolean | Enables or disables the password field on the client. Defaults to `true` |

Usage example:

```js
export default {
  auth: {
    password: {
      confirm: true,
      sendConfirmationEmail: true,
      sendAddNewUserEmail: true,
      minLength: 8,
      enabled: true
    }
  }
}
```

#### `certificate`

Configures your application for using Secure Sockets Layer (SSL). 

| certificate           | Object  | Contains the global properties for the SSL certificate          |
| --------------------- | ------- | --------------------------------------------------------------- |
| devSerial             | String  | Sets the SSL certificate serial number number. Defaults to `00` |
| enabled               | Boolean | Enables the use of SSL certificate. Defaults to `false`         |

**NOTE**: the `CERTIFICATE_DEVSERIAL` constant is initialized to `00` in the `config/user.js` file.

Usage example:

```js
export default {
  auth: {
    certificate: {
      devSerial: CERTIFICATE_DEVSERIAL,
      enabled: false
    }
  }
}
```

#### `facebook`

The `facebook` property contains configurations for Facebook authentication implemented with [passport-facebook].

| facebook      | Object        | Contains the global properties for Facebook authentication                    |
| ------------- | ------------- | ----------------------------------------------------------------------------- |
| enabled       | Boolean       | Enables authentication via Facebook                                           |
| clientID      | String        | Sets the Facebook app ID                                                      |
| clientSecret  | String        | Sets the Facebook app secret                                                  |
| callbackURL   | String        | Sets the Facebook app callback URL                                            |
| scope         | Array<String> | Sets the Facebook app scope                                                   |
| profileFields | Array<String> | Sets the profile fields that Facebook returns upon the authentication request |

**NOTE**: To enable authentication with Facebook, set `auth.facebook.enabled` to `true`. Also, add the 
`FACEBOOK_CLIENTID` and `FACEBOOK_CLIENTSECRET` values into the `packages/server/.env` file:

```dotenv
FACEBOOK_CLIENTID="set to your Facebook client ID. It's similar to bv32cu82e926u543a534ha"
FACEBOOK_CLIENTSECRET="set to your Facebook client secret. It's similar to 56g7heuz7dhwq725r78wern73a92c3fsfd7430e9"
``` 

To get the client ID and client secret values, you need to register with [Facebook Apps]. Consult [Connect Your App to 
Facebook] for details.

**NOTE**: When you create a Facebook application with Facebook Apps, you need to enter the correct **absolute** callback 
URL to the **Valid OAuth redirect URIs** field.

The `auth.facebook.callbackURL` property stores the relative callback URL `/auth/facebook/callback`, which gets 
concatenated with `http://localhost:3000/` in development mode. The absolute callback URL for Facebook Login is 
`http://localhost:3000/auth/facebook/callback`, and you need to add this URL to Facebook Login for development mode.

#### `github`

The `github` property contains configurations for GitHub authentication implemented with [passport-github].

| github       | Object        | Contains the global properties for GitHub authentication |
| ------------ | ------------- | -------------------------------------------------------- |
| enabled      | Boolean       | Enables authentication via GitHub                        |
| clientID     | String        | Sets the GitHub app ID                                   |
| clientSecret | String        | Sets the GitHub app secret                               |
| callbackURL  | String        | Sets the GitHub app callback URL                         |
| scope        | Array<String> | Sets the [GitHub OAuth apps scopes]                      |

**NOTE**: To enable authentication with GitHub, set `auth.github.enabled` to `true`. Also, add the `GITHUB_CLIENTID` and 
`GITHUB_CLIENTSECRET` values into the `packages/server/.env` file:

```dotenv
GITHUB_CLIENTID="Use your GitHub client ID. It's similar to bv32cu82e926u543a534ha"
GITHUB_CLIENTSECRET="Use your GitHub client secret. It's similar to 56g7heuz7dhwq725r78wern73a92c3fsfd7430e9"
```

To get the client ID and client secret values, you need to register with [GitHub OAuth Apps]. Consult [Connect Your App 
to GitHub] for details.

**NOTE**: When you create a GitHub application with GitHub OAuth Apps, you need to enter the correct **absolute** 
callback URL into the **Authorization callback URL** input field. 

The `auth.github.callbackURL` property stores the relative callback URL `/auth/github/callback`, which gets concatenated 
with `http://localhost:3000/`. The absolute callback URL for GitHub is `http://localhost:3000/auth/github/callback`, and 
you need to add this URL to your app in [GitHub OAuth Apps] settings for development mode.

#### `linkedin`

The `linkedin` property contains configurations for LinkedIn authentication implemented with [passport-linkedin].

| linkedin     | Object        | Contains the global properties for LinkedIn authentication |
| ------------ | ------------- | ---------------------------------------------------------- |
| enabled      | Boolean       | Enables authentication via LinkedIn                        |
| clientID     | String        | Sets the LinkedIn app ID                                   |
| clientSecret | String        | Sets the LinkedIn app secret                               |
| callbackURL  | String        | Sets the LinkedIn app callback URL                         |
| scope        | Array<String> | Sets [LinkedIn application permissions]                    |

**NOTE**: To enable authentication with LinkedIn, set `auth.linkedin.enabled` to `true`. Also, add the 
`LINKEDIN_CLIENTID` and `LINKEDIN_CLIENTSECRET` values into the `packages/server/.env` file:

```dotenv
LINKEDIN_CLIENTID="Use your LinkedIn client ID. It's similar to bv32cu82e926u543a534ha"
LINKEDIN_CLIENTSECRET="Use your LinkedIn client secret. It's similar to 56g7heuz7dhwq725r78wern73a92c3fsfd7430e9"
```

To get the client ID and client secret values from LinkedIn, you need to register with [LinkedIn OAuth Apps]. Consult 
[Connect Your App to LinkedIn] for details.

**NOTE**: When you create a LinkedIn application with LinkedIn OAuth Apps, you need to enter the correct **absolute** 
callback URL into the **Authorized Redirect URLs** input field. 

The `auth.linkedin.callbackURL` property stores the relative callback URL `/auth/linkedin/callback`, which gets 
concatenated with `http://localhost:3000/`. The absolute callback URL for LinkedIn is 
`http://localhost:3000/auth/linkedin/callback`, and you need to add this URL to your app in [LinkedIn OAuth Apps] 
settings for development mode.

#### `google`

The `google` property contains configurations for Google authentication implemented with [passport-google].

| google       | Object        | Contains the global properties for Google authentication |
| ------------ | ------------- | -------------------------------------------------------- |
| enabled      | Boolean       | Enables authentication with Google OAuth                 |
| clientID     | String        | Sets the Google app ID                                   |
| clientSecret | String        | Sets the Google app secret                               |
| callbackURL  | String        | Sets the Google app callback URL                         |
| scope        | Array<String> | Sets the [Google auth scopes]                            |

**NOTE**: To enable authentication with Google, set `auth.google.enabled` to `true`. Also, add the `GOOLGE_CLIENTID` and 
`GOOLGE_CLIENTSECRET` values into the `packages/server/.env` file:

```dotenv
GOOLGE_CLIENTID="Use your Google client ID. It's similar to bv32cu82e926u543a534ha"
GOOLGE_CLIENTSECRET="Use your Google client secret. It's similar to 56g7heuz7dhwq725r78wern73a92c3fsfd7430e9"
```

To get the client ID and client secret values from Google, you need to register with [Google Identity Platform]. Consult 
[Connect Your App to Google] for details.

**NOTE**: When you create a Google application with Google Identity Platform, you need to enter the correct **absolute** 
callback URL into the **Authorized redirect URIs** input field. 

The `auth.google.callbackURL` property points to the relative callback URL `/auth/google/callback`, which gets 
concatenated with `http://localhost:3000/`. The absolute callback URL for Google is 
`http://localhost:3000/auth/google/callback`, and you need to add this URL to your app in Google Identity Platform 
settings for development mode.

**NOTE**: You may also need to activate Google+ API to be able to authenticate with Google, otherwise, you may see the 
error `ServerError: Access Not Configured. Google+ API has not been used in project 245355975001 before or it is 
disabled.` (Instead of `245355975001` the error will contain the actual number of your project.)

You can also view the error in the console:

```
name: 'GooglePlusAPIError',
message: 'Access Not Configured. Google+ API has not been used in project 245355975001 before or it is disabled. Enable 
it by visiting https://console.developers.google.com/apis/api/plus.googleapis.com/overview?project=245355975001 then 
retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.',
code: 403 }
```
 
If the error was produced, you need to visit the link shown in the terminal and activate Google+ for your application. 

[opening vs code with urls]: https://code.visualstudio.com/docs/editor/command-line#_opening-vs-code-with-urls
[visual studio code url handler]: https://github.com/sysgears/vscode-handler#visual-studio-code-url-handler
[spinjs]: https://github.com/sysgears/spinjs
[spinjs documentation]: https://github.com/sysgears/spinjs/blob/master/docs
[twitter bootstrap]: http://getbootstrap.com
[ant design]: https://ant.design
[ant design mobile]: https://mobile.ant.design
[nativebase]: https://nativebase.io/
[postgresql socket path]: https://www.postgresql.org/message-id/21044.1326496507@sss.pgh.pa.us
[mysql socket path]: https://dev.mysql.com/doc/refman/8.0/en/problems-with-mysql-sock.html
[postgres connection uris]: https://www.postgresql.org/docs/10/static/libpq-connect.html
[connecting using a uri string]: https://dev.mysql.com/doc/refman/8.0/en/connecting-using-path.html#connecting-using-paths-uri
[apollo engine]: https://www.apollographql.com/engine/
[engine api key]: https://www.apollographql.com/docs/engine/setup-node.html#api-key
[iso language codes]: http://www.lingoes.net/en/translator/langcode.htm
[i18next documentation]: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
[i18next-express-middleware]: https://github.com/i18next/i18next-express-middleware#detector-options
[general options]: https://nodemailer.com/smtp/#general-options
[authentication]: https://nodemailer.com/smtp/#authentication
[`docs/modules/mobileChat.md`]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/docs/modules/mobileChat.md
[dedicated apollo blog post]: https://blog.apollographql.com/understanding-pagination-rest-graphql-and-relay-b10f835549e7
[`docs/modules/stripeSubscription.md`]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/docs/modules/stripeSubscription.md
[passport-facebook]: https://github.com/jaredhanson/passport-facebook
[facebook apps]: https://developers.facebook.com/apps
[connect your app to facebook]: https://auth0.com/docs/connections/social/facebook
[passport-github]: https://github.com/jaredhanson/passport-github
[github oauth apps scopes]: https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
[github oauth apps]: https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/
[connect your app to github]: https://auth0.com/docs/connections/social/github
[passport-linkedin]: https://github.com/jaredhanson/passport-linkedin
[linkedin application permissions]: https://developer.linkedin.com/docs/oauth2#permissions
[linkedin oauth apps]: https://www.linkedin.com/developer/apps
[connect your app to linkedin]: https://auth0.com/docs/connections/social/linkedin
[passport-google]: https://github.com/jaredhanson/passport-google
[google auth scopes]: https://developers.google.com/gmail/api/auth/scopes
[google identity platform]: https://developers.google.com/identity/choose-auth
[connect your app to google]: https://auth0.com/docs/connections/social/google