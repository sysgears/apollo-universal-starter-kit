# Deployment with Apollo Universal Starter Kit

## Deploying to Linux Running on Node.js

1. Clone the latest stable starter kit.

```bash
git clone -b stable https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

2. Install dependencies:

```bash
yarn
```

3. Seed production database data from the command line:

```bash
NODE_ENV=production yarn seed
```

4. Replace the default server port and website URL in `packages/server/.spinrc.js` to match your production setup: 

```javascript
config.options.defines.__SERVER_PORT__ = 8080; // Set to your server port
config.options.defines.__WEBSITE_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com"'; // Set the URL for prod
``` 

5. If you need to run the mobile app, set the `__API_URL__` and `__WEBSITE_URL__` values in `packages/mobile/.spinrc.js`:

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

6. Compile the project:

```bash
yarn build
```

7. Run the project in production mode:

```bash
yarn start
```

## Deploying to Heroku

1. Create an account on [Heroku].

2. Install the [Heroku Command Line Interface] (CLI):
    
    - On Ubuntu, run `sudo snap install heroku --classic`
    - For Windows and MacOS, download the appropriate installer from [Heroku Command Line Interface]

3. Log in to Heroku CLI with your Heroku login and password (follow the suggestions shown by the CLI):

```bash
heroku login
```

4. Create your application on Heroku via the CLI. Use the name of your application instead of `application-name`:

```bash
heroku create application-name
```

In the command line will generate two links. The first link is the URL for your Heroku application, while the second is 
the Git repository to which you'll push your application:

```bash
https://application-name.herokuapp.com/ | https://git.heroku.com/application-name.git
```

Consult [deploying a Node.js app] for full details about creating your application on Heroku.
 
5. Create an account in [Expo] for publishing your mobile app (optional).

6. Set your deployment configuration variables in [Heroku Dashboard]. 

    * Choose your application and then follow to the `Settings` tab. In Settings, click on the `Config Variables` link. 
    Add a variable `YARN_PRODUCTION` and set it to `false`. Additionally, if you're also deploying a mobile app, you 
    need to set the variable `EXP_USERNAME` to `your_expo_account_username` and `EXP_PASSWORD` to 
    `your_expo_account_password`. The `EXP_USERNAME` and `EXP_PASSWORD` config variables will be used to publish your 
    mobile Expo application.

    * Configure your SMTP server to let your application register new users. By default, Apollo Universal Starter Kit uses 
`ethereal.email`, but Ethereal shouldn't be used for production application.

| Variable       | Value                      |
| -------------- | -------------------------- |
| EMAIL_HOST     | mailboxExample.example.com | 
| EMAIL_PASSWORD | examplePassword            |
| EMAIL_USER     | example@example.com        | 

7. Set proper values for server website url in `packages/server/.spinrc.js` to match your production setup.
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

8. Push to Heroku remote repository. Commit your changes and run ```git push heroku master``` or if you would like to 
push another branch run ```git push --force heroky branchExample:master```

9. Heroku automatic starts the building the project and publishing website to Heroku and mobile apps to expo.io.

## Publishing a Mobile App

1. Compile your project for production:

```bash
yarn build
```

2. Run the following command to publish your mobile app:

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

3. Run `yarn exp bs` to get the status and links for signed standalone mobile apps when the build finishes. 

For more details refer to Building Standalone Apps in [the Expo documentation], but use `yarn exp ..` instead of 
`exp ...` command.

[heroku]: https://heroku.com
[deploying a Node.js app]: https://devcenter.heroku.com/articles/getting-started-with-nodejs
[heroku dashboard]: https://dashboard.heroku.com/apps
[heroku command line interface]: https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
[heroku sign up]: https://signup.heroku.com/dc
[expo]: https://expo.io
[genymotion]: https://www.genymotion.com
[xcode]: https://developer.apple.com/xcode/
[virtualbox]: https://www.virtualbox.org/wiki/Downloads
[android studio]: https://developer.android.com/studio/
[README.md]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/README.md
[the Expo documentation]: https://docs.expo.io/versions/latest/
[Features and Modules]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Features-and-Modules