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

**NOTE**: Most scripts in `apollo-universal-starter-kit/package.json` run with [Lerna], a tool that enables us to
simultaneously run the same scripts for all the packages &ndash; client, server, and mobile.

### `yarn build`

Compiles the production application to the `packages/server/build`, `packages/client/build`, and `packages/mobile/build`
directories for the server, client, and mobile applications respectively.

### `yarn clean`

Removes the compiled production application files from the `packages/server/build`, `packages/client/build`, and
`packages/mobile/build` folders.

### `yarn start`

Runs the Apollo Universal Starter Kit application in production mode. The application will be open in your default
browser. The application code is minified and optimized to ensure the best performance.

### `yarn watch`

Runs the app in development mode and watches the changes made to the code with the help of hot code reload.

The `yarn watch` command has a few specific implementations.

#### `yarn watch-client`

Runs the client-side React application in development mode and watches the changes using hot code reload.

This command is especially useful if you're developing a Scala back-end application or your custom back-end app and you
don't need the Express application to run. Also note that the server-side rendering is _turned off_ if you run
`yarn watch-client`.

#### `yarn watch:angular`

Runs only the Angular frontend application in development mode.

#### `yarn watch:vue`

Runs only the Vue frontend application in development mode.

#### `yarn watch:android`

Runs only the Android app in development mode.

#### `yarn watch:ios`

Runs only the iOS app in development mode.

### `yarn android`

Runs the Expo Android project _and_ the Express back-end application in development mode. The command disables
building the project for the web (the React application) and iOS platforms.

### `yarn ios`

Runs the Expo iOS project _and_ the Express back-end application in development mode. The command disables building the
project for the web (the React application) and Android platforms.

### `yarn cli`

Runs the Apollo Universal Starter Kit built-in command line interface (CLI). The CLI is currently used for scaffolding
and deleting Apollo Starter Kit modules. Consult the [CLI guide] for more information about `yarn cli`.

### `yarn stripe:setup`

Generates the Stripe plan for the payment module in Apollo Starter Kit. The default Stripe configuration used for
generation of the plan is located in `config/stripe/subscription.js`.

### `yarn seed`

Seeds the sample data to the SQLite database. You can use the `yarn seed --prod` command for production mode.

### `yarn migrate`

Migrates the sample database. The command updates the database according to the latest migrations.

### `yarn rollback`

Rolls back the sample database to the previous state. The command simply cancels the last migration created with
`yarn migrate`.

### `yarn jest`

Runs the tests for the mobile app using Jest, a Facebook utility for running unit tests for React Native apps. You can
view a demo unit test for mobile in the `packages/mobile/src/__tests__` directory.

### `yarn test`

Runs the unit tests with Mocha and the static code checking with TSLint and ESLint.

### `yarn tests`

Runs the unit tests with Mocha and waits until all the tests are executed. The test results will be shown in the
console.

### `yarn tests:watch`

Runs the unit tests with Mocha, waits until they're executed, and automatically watches the changes to the tests or
application code. Once the changes are made, the tests will re-run (one or more tests will be executed again depending
on how many changes you've made).

### `yarn lint`

Runs the [ESLint] to perform checks for errors in `.js`, `.jsx`, `.ts`, and `.tsx` files.

### `yarn heroku-postbuild`

Runs various commands specific for Heroku for Apollo Starter Kit client, server, and mobile packages.
Once you publish your application on Heroku, this command will run `yarn build` for the client, server, and mobile
packages. For example, after you build the project for Heroku, this command will publish the mobile app: It'll run
`exp publish`, then log in to Expo, compile the mobile builds and publish them on Expo.

### `yarn precommit`

Runs additional checks before the code is committed to Git.

`yarn precommit` is a utility command that runs each time you commit your changes to Git. You don't need to run this
command separately, although doing so won't create any issues.

`yarn precommit` runs the [lint-staged] utility to find any changes in `.js`, `.jsx`, and `.json` files and fix errors
if any. If changes were made in TypeScript files, then TSLint will run to check the code updates. If linting issues in
the files are fixed, the file is committed to Git. During the checks, the code is also forcibly formatted.

When formatting the code isn't possible, however, the changes won't be committed, and the issues (the files and the
lines where issues were found) will be shown in the console.

[lerna]: https://lernajs.io/
[cli guide]: /docs/tools/CLI.md
[`expo`]: https://docs.expo.io/versions/latest/workflow/expo-cli
[webpack]: https://webpack.js.org/
[haul cli]: https://github.com/callstack/haul
[metro bundler]: https://facebook.github.io/metro/
[expo cli documentation]: https://docs.expo.io/versions/latest/workflow/expo-cli
[esLint]: https://eslint.org/
[lint-staged]: https://www.npmjs.com/package/lint-staged
