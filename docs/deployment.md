# Deployment with Apollo Universal Starter Kit

## Deploying to Linux Running Node.js

1. Clone the latest stable starter kit.

```bash
git clone -b stable https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

2. Install dependencies:

```bash
yarn
```

3. Seed production database data:

```bash
NODE_ENV=production yarn seed
```

4. Set proper values for `config.options.defines.__SERVER_PORT__` and `config.options.defines.__WEBSITE_URL__` in 
`packages/server/.spinrc.js` to match your production setup.

5. If you need to run the mobile app, edit the following lines in `packages/mobile/.spinrc.js`:

```javascript
// Other configurations for the mobile app are omitted for brevity

if (process.env.NODE_ENV === 'production') {
  // Other settings are omitted for brevity
  // Change the following two line
  config.options.defines.__API_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com/graphql"';
  config.options.defines.__WEBSITE_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com"';
  // Other settings are omitted for brevity
}
```

If you are deploying on Heroku without a custom domain name, the production URLs may look like this:

```javascript
// code is omitted for brevity
config.options.defines.__API_URL__ = '"https://<AppName>.herokuapp.com/graphql"';
config.options.defines.__WEBSITE_URL__ = '"https://<AppName>.herokuapp.com"';
// code is omitted for brevity
```

5. Compile the project:

```bash
yarn build
```

6. Run the project in production mode:

```bash
yarn start
```

## Deploying to Heroku



1. Create an account on the Heruku - [Heroku sign up]

2. Install the [Heroku Command Line Interface] (CLI):
- Ubuntu - run ```sudo snap install heroku --classic```
- Windows/macOS - download the appropriate installer: [Heroku Command Line Interface]

3. Login with Heroku cli - run ```heroku login``` in the terminal and enter login and password from Heroku.

4. Create your app on the heroku via CLI - ```heroku create application-name-example``` where ```application-name-example```
 is name of your aplication and future basic url (domain name). This operation also adds ```git remote``` with 
 the name ```heroky``` for pushing. If ```git remote``` was not added - you can see git link in your heroku 
 dashboard settings.
 (Full tutorial you can see here: [Deploying a Node.js app])
 
5. Create account in [expo.io] for publishing the mobile apps.

6. Set your deployment config Variables to the Heroku.
Go to your Heroku [Dashboard], choose your application, under the `Settings` tab, click `Config Variables`. 
Then you need to add basic variables which for the basic production app should look like this: 

| Var key        | Var Value           |
| ------------- |:-------------:|
| YARN_PRODUCTION      | false | 
| EXP_USERNAME     | exampleUsername      | 
| EXP_PASSWORD | examplePassword     | 
The `EXP_USERNAME` and `EXP_PASSWORD` config variables will be used to publish your mobile Expo applications.

Also you need to set the email setting (for conformation the new registered account). 
But it's not important, because Kit uses ```ethereal.email``` as Fake smtp service - you just will not have possibility to sign up new accounts.

| Var key        | Var Value           |
| ------------- |:-------------:|
| EMAIL_HOST      | mailboxExample.example.com | 
| EMAIL_PASSWORD     | examplePassword      | 
| EMAIL_USER | example@example.com     | 


6. Set proper values for server website url in `packages/server/.spinrc.js` to match your production setup.
 - If you are deploying your app on Heroku without a custom domain name, the production URLs will look like this:

```javascript
config.options.defines.__WEBSITE_URL__ = '"https://application-name-example.herokuapp.com"';
```
```applicationNameExample``` - name of your application from the 4 part.

 - If you your custom domain, the production URLs will look like this:

```javascript
config.options.defines.__WEBSITE_URL__ = '"http://domainExample.com"';
```
**http/https** - depends of your plan.
Also, to use your custom domain name, you need to add this domain in the Heroku dashboard, in the `Settings` tab.


7. In order for the mobile Expo app to connect to the back-end URL, edit `packages/mobile/.spinrc.js`.
- If you are deploying your app on Heroku without a custom domain name, the production URLs will look like this:

```javascript
config.options.defines.__API_URL__ = '"https://application-name-example.herokuapp.com/graphql"';
config.options.defines.__WEBSITE_URL__ = '"https://application-name-example.herokuapp.com"';
```
```applicationNameExample``` - name of your application from the 4 part.

 - If you your custom domain, the production URLs will look like this:

```javascript
config.options.defines.__API_URL__ = '"http://domainExample.com/graphql"';
config.options.defines.__WEBSITE_URL__ = '"http://domainExample.com"';
```
**http/https** - depends of your plan.
Also, to use your custom domain name, you need to add this domain in the Heroku dashbouard, in the `Settings` tab.

8. Push to Heroku remoute repository. Commit your changes and run ```git push heroky master``` or if you would like to push another branch 
run ```git push --force heroky branchExample:master```

9. Heroku automatic starts the building the project and publishing website to Heroku and mobile apps to expo.io.

## Publishing a Mobile App

1. Compile your project for production:

```bash
yarn build
```

2. Run the following command:
```bash
yarn exp publish
```

## Building a Standalone Mobile App for Google Play or App Store

1. Compile your project for production:

```bash
yarn build
```
 
2. Run the command below to build a signed `.apk` for Android:

```bash
yarn exp ba
```

You need to run the command below to build a signed `.iap` for iOS:

```bash
yarn exp bi
```

3. Run `yarn exp bs` to get status and links for signed standalone mobile applications when the build finishes. 
For more details refer to **Building Standalone Apps** in [the Expo documentation], but use `yarn exp ..` instead of 
`exp ...` command.


[heroku]: https://heroku.com
[Deploying a Node.js app]: https://devcenter.heroku.com/articles/getting-started-with-nodejs
[Dashboard]: https://dashboard.heroku.com/apps
[Heroku Command Line Interface]: https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
[Heroku sign up]: https://signup.heroku.com/dc

[expo.io]: https://expo.io
[genymotion]: https://www.genymotion.com
[xcode]: https://developer.apple.com/xcode/
[virtualbox]: https://www.virtualbox.org/wiki/Downloads
[android studio]: https://developer.android.com/studio/
[README.md]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/README.md
[the Expo documentation]: https://docs.expo.io/versions/latest/
[Features and Modules]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Features-and-Modules