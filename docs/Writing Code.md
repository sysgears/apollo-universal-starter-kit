# Writing Code for Your Apollo Universal Starter Kit Project

## Configuring Your IDE or a Text Editor

We strongly recommend that you enable [ESLint] and [TSLint] in your text editor or an Integrated Development 
Environment. ESLint and TSLint will help you improve the quality of your JavaScript and TypeScript code and avoid 
various pitfalls.

## Writing the Code

The starter kit provides full support for modules written in JavaScript (both ES6- and ES7-styles) and TypeScript. You 
can freely mix the languages and write modules (and even parts of modules) in ES6, ES7, and TypeScript at the same time. 

When writing TypeScript modules, however, you may face various pitfalls. A general discussion about TypeScript pitfalls 
will be handled in the [Apollo Universal Starter Kit issues section]. The recipes from discussion will be added into the 
[Recipes for Common TypeScript Pitfalls](#recipes-for-common-typescript-pitfalls) section.

### Recipes for Common TypeScript Pitfalls

* TypeScript has limited support for the code in files with custom extensions. 

Because of the problem above, all the files with code written for the web platform should have the `.ts` extension, not 
`.web.ts`, to let the TypeScript compiler find the file. And if the same file contains different implementations 
for the Android and iOS platforms, this file should have the extension `.native.ts`. 

In JavaScript, when you import `somefile`, you typically avoid including the platform-specific extensions. Put simply, 
you don't need to to write `import { SomeClass } from 'somefile.native'`, because the extension is automatically 
determined at the compile time.

With TypeScript, however, the situation is different, as `somefile` and `somefile.native.ts` might export different 
interfaces, which is why you have to import modules this way `import { Some Class } from 'somefile.native'`.

* `locales/index.js` must be kept in JavaScript for now. If you rename this file to use the `.ts` extension, you'll run 
into incompatibilities between `@alienfast/i18next-loader` and the TypeScript compiler. You can fix this issue by making 
changes to `@alienfast/i18next-loader`.

* When using a stateless JSX component written in JavaScript from within the TypeScript code, you can get the error 
`TS2322 missing key`, despite the fact that the key in question is declared optional. The workaround is to convert this 
stateless component into a stateful JSX component.

* TSLint complains that a module is missing, though the module is presented in `peerDependencies`. 

TSLint checks `dependencies` and _either_ `peerDependencies` _or_ `devDependencies`, not both! This is why TSLint may
complain that a module is missing. For Apollo Universal Starter Kit, we've configured TSLint to look into 
`dependencies`, `devDependencies`, and `optionalDependencies` when resolving modules. 

You can work around this issue by switching from using `peerDependencies` in `package.json` to `optionalDependencies`. 
This way both ESLint and TSLint will find all required modules.

## Naming Convention

We recommend that you stick to the following convention when naming the files for different platforms:

```
MyComponent.jsx            // for the client-side app
MyComponent.native.jsx     // for the mobile app
MyComponent.android.jsx    // for the Android app
MyComponent.ios.jsx        // for the iOS app
```

Notice that you can use three extensions for the mobile platform &ndash; `.native.jsx`, `.android.jsx`, and `ios.jsx`.
You should use `.native.jsx` when the logic written in the file is related to both Android and iOS platforms. If you 
need to write custom logic for Android or iOS, use `.android.jsx` or `.ios.jsx` extensions respectively.

[eslint]: https://eslint.org/
[tslint]: https://palantir.github.io/tslint/
[apollo universal starter kit issues section]: https://github.com/sysgears/apollo-universal-starter-kit/issues/785