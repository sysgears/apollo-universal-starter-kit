# Available Scripts

Apollo Universal Starter Kit comes with a root `package.json` file that contains commands you can run for all the 
packages &ndash; web, server, and mobile.

You can run the scripts from the root of your Apollo Universal Starter Kit project:

```bash
# project root, typically apollo-universal-starter-kit
yarn build
```

Alternatively, you can run all the scripts using NPM:

```bash
npm run build
```

## Global Scripts in `root/package.json`

**NOTE**: Most Yarn scripts in `apollo-universal-starter-kit/package.json` run with [Lerna], which enables us to 
simultaneously run the same Yarn scripts for all the packages &ndash; client, server, and mobile.

### `yarn build`

Compiles the production application to the `packages/server/build`, `packages/client/build`, and `packages/mobile/build` 
directories for the server, client, and mobile applications respectively.

### `yarn clean`

Removes the compiled production application files from the `build/` folders for the server, client, and mobile packages.

### `yarn start`

Runs the Apollo Universal Starter Kit application in production mode.

### `yarn watch`

Runs the app in development mode and watches the changes made to the code using hot code reload.

### `yarn exp`

Runs the `exp` Expo command.

**NOTE**: Apollo Universal Starter Kit uses the `exp` command, not the [`expo` command] that was recently suggested 
for use by Expo. Currently, Expo allows you to use both `exp` and `expo`, but **the starter kit supports only `exp`**! 

The command `yarn exp` is a wrapper around the `exp` command from the Expo SDK. The `exp` command in the starter kit is 
in fact run by the [SpinJS] library, which creates the React Native app builds using [webpack] and [Haul CLI] 
**instead** of the Metro bundler created by Facebook specifically to compile the React Native apps.

The `yarn exp` command supports only the following `exp` (Expo CLI) commands: 

* `build:android` or `ba`
* `build:ios` or `bi`
* `publish` or `p`

To learn more about these Expo commands, consult the official [Expo CLI documentation].

### `yarn exp-publish`

Runs the mobile app in development mode and watches your changes to the application. Upon any changes made to the app, 
the bundle will be updated and reloaded that to hot code reload.                                                        

### `yarn jest`

Runs the tests for the mobile app using Jest, a Facebook utility for running unit tests for React Native apps. You can 
view the demo unit test for mobile in the `packages/mobile/src/__tests__` directory. 

### `yarn test`

Runs the unit tests with Mocha and the static code checking with TSLint and ESLint.

### `yarn tests`

Runs the unit tests with Mocha and waits until all the tests are executed. Your default browser will open with the test 
results.

### `yarn tests:watch` 

Runs the unit tests with Mocha, waits until they're executed, and automatically watches the changes to the tests or 
application code. Once the changes are made, the tests will re-run (one or more tests will be executed again depending
on how many changes you made).

### `yarn lint`

Runs the `eslint` and `tslint` scripts to perform checks for errors in `.js`, `.jsx`, `.ts`, and `.tsx` files.

### `yarn eslint`

Runs the static code checks using [ESLint] for JavaScript (the `.js` and `.jsx` files) to find any errors made by 
developers. The errors are fixed if possible.

### `yarn tslint`

Runs the static code checks for TypeScript (the `.ts` and `.tsx` files) to find any errors made by developers. The 
errors are fixed if possible.

### `yarn seed`

Seeds sample data to the SQLite database. You can use the `yarn seed --prod` command for production mode.

### `yarn migrate`

Migrates the sample database. The command updates the database according to the latest migrations.

### `yarn rollback`

Rolls back the sample database to the previous state. The command simply cancels the last migration created with 
`yarn migrate`.

### `yarn heroku-postbuild`

Runs various commands specific for Heroku for Apollo Starter Kit client, server, and mobile packages.
Once you publish your application on Heroku, this command will run `yarn build` for the client, server, and mobile 
packages. For example, after you build the project for Heroku, this command will publish the mobile app. It'll run 
`exp publish`, then log in to Expo, compile the mobile builds and publishes them on Expo.

### `yarn cli`

Runs the Apollo Universal Starter Kit built-in command line interface (CLI). The CLI is currently used for scaffolding 
and deleting Apollo Starter Kit modules. Consult the [CLI guide] for more information about the command.

### `yarn precommit`

Runs additional checks before the code is committed to Git. 

`yarn precommit` is a utility command that runs each time you commit your changes to Git. You don't need to run this command 
separately, although doing so won't create any issues.

The command will run the [lint-staged] utility to find any changes in `.js`, `.jsx`, and `.json` files and fix errors if
any. If the changes were made in TypeScript files, then TSLint will run to check the code updates. If linting issues in 
the files are fixed, the file is committed to Git. During the checks, the code is also forcibly formatted.

If formatting the code isn't possible, the changes won't be committed, and the issues (the files and the lines where an 
issue was found) will be shown in the console.

### `yarn stripe:setup`

Generates the Stripe plan for the payment module in Apollo Starter Kit. The default Stripe configuration used for 
generation of the plan is located in `config/stripe/subscription.js`.

[cli guide]: https://github.com/sysgears/apollo-universal-starter-kit/wiki/Apollo-Starter-Kit-CLI
[spinjs]: https://github.com/sysgears/spinjs
[webpack]: https://webpack.js.org/
[`expo` command]: https://docs.expo.io/versions/latest/workflow/expo-cli
[expo cli documentation]: https://docs.expo.io/versions/latest/workflow/expo-cli
[esLint]: https://eslint.org/
[tslint]: https://palantir.github.io/tslint/ 
[lint-staged]: https://www.npmjs.com/package/lint-staged