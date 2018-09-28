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
config.options.defines.__SERVER_PORT__ = 8080;
config.options.defines.__WEBSITE_URL__ = '"https://your-website-name.com"';
``` 

5. If you need to run the mobile app, set the `__API_URL__` and `__WEBSITE_URL__` properties in 
`packages/mobile/.spinrc.js`:

```javascript
// Other configurations for the mobile app are omitted for brevity

if (process.env.NODE_ENV === 'production') {
  // Other settings are omitted for brevity
  // Change the following two line
  config.options.defines.__API_URL__ = '"https://your-website-name.com/graphql"';
  config.options.defines.__WEBSITE_URL__ = '"https://your-website-name.com"';
  // Other settings are omitted for brevity
}
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

3. Log in to the Heroku CLI with your Heroku login and password and follow the suggestions shown by the CLI:

```bash
heroku login
```

4. Create your application on Heroku via the CLI. Use the name of your application instead of `application-name`:

```bash
heroku create application-name
```

The command line will generate two links. The first link is the URL for your Heroku application, while the second URL is 
the Git repository to which you'll push your application:

```bash
https://application-name.herokuapp.com/ | https://git.heroku.com/application-name.git
```
Consult [deploying a Node.js app] for full details about creating your application on Heroku.
 
5. Set your deployment configuration variables in [Heroku Dashboard]. 

Click the name of your application in the list and then follow to the `Settings` tab. In Settings, click on the 
`Config Variables` link and add the following variable: 

| Variable        | Value |
| --------------- | ----- |
| YARN_PRODUCTION | false |

**NOTE**: If you don't need the mobile app when deploying to Heroku, open the file `packages/mobile/.spinrc.js` and set 
both `config.builders.android.enabled` and `config.builders.ios.enabled` to `false` as shown in the example below:
          
```javascript
if (process.env.NODE_ENV === 'production') {
    config.builders.android.enabled = false;
    config.builders.ios.enabled = false;
    // Other code is omitted for brevity
}
```
 
However, if you want to deploy a mobile app, first create an account in [Expo]. Additionally, you need to set these 
three variables in Heroku dashboard:

| Variable        | Value                      |
| --------------- | -------------------------- |
| YARN_PRODUCTION | false                      |
| EXP_USERNAME    | your_expo_account_username | 
| EXP_PASSWORD    | your_expo_account_password |
    
**NOTE**: To register new users, configure your SMTP server. By default, Apollo Universal Starter Kit uses [Ethereal] 
for the fake SMTP server, but you shouldn't use Ethereal for production application because the registration emails with 
the validation link will be sent to Ethereal, _not_ to the real users.

| Variable       | Value                      |
| -------------- | -------------------------- |
| EMAIL_HOST     | mailboxExample.example.com | 
| EMAIL_PASSWORD | examplePassword            |
| EMAIL_USER     | example@example.com        | 

6. Set proper values for server website URL in `packages/server/.spinrc.js` to match your production setup.
 
- If you're deploying your application on Heroku without a custom domain name, the production URL will look like this:

```javascript
config.options.defines.__WEBSITE_URL__ = '"https://application-name.herokuapp.com"';
```

`application-name` is the name of your application you've generated at the step 4 (creation of an app with the Heroku 
CLI).

- If you're using a custom domain, the production URL will look like this:

```javascript
config.options.defines.__WEBSITE_URL__ = '"http://domain-example.com"';
```

Also, to use your custom domain name, you need to add this domain in [Heroku Dashboard]. Select your application from
the list, and then follow to the `Settings` tab. Scroll to the button **Add domain** and add your domain.  

7. If you're deploying your mobile app to Expo, you need to connect the app to the back-end URL. To do that, edit the 
`packages/mobile/.spinrc.js` file:

- If you are deploying your app on Heroku without a custom domain name, the production URLs will look like this:

```javascript
config.options.defines.__API_URL__ = '"https://application-name.herokuapp.com/graphql"';
config.options.defines.__WEBSITE_URL__ = '"https://application-name.herokuapp.com"';
```

- If you're using a custom domain, the production URLs will look like this:

```javascript
config.options.defines.__API_URL__ = '"http://domain-example.com/graphql"';
config.options.defines.__WEBSITE_URL__ = '"http://domain-example.com"';
```

8. Commit your changes and run (use the name of your application instead of `application-name` in the link above):
 
```bash
git push https://git.heroku.com/application-name.git
```

If you're deploying from another branch (not from master) run:
 
```bash
git push --force heroku your_branch:master
```

9. Heroku automatically starts building your project and publishing a website to Heroku and mobile app to [Expo.io].

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
[ethereal]: https://ethereal.email/
[README.md]: https://github.com/sysgears/apollo-universal-starter-kit/blob/master/README.md
[the Expo documentation]: https://docs.expo.io/versions/latest/
[Features and Modules]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Features-and-Modules