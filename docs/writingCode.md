# General Considerations for Writing Code for Apollo Universal Starter Kit

## Configuring Your IDE or a Text Editor

We strongly recommend that you enable the [ESLint] and [TSLint] integrations in your text editor or an Integrated Development Environment. Using ESLint and TSLint will help you improve the quality of your code and avoid various pitfalls.

## Writing the Code

The starter kit provides full support for modules written in JavaScript (both ES6- and ES7-styles) and TypeScript. You can mix the languages and write modules (and even parts of modules) in ES6, ES7, and TypeScript at the same time. This way, when you need more flexibility, you can write code in plain JavaScript; and when you want more type safety, you can opt into writing code in TypeScript.

When writing TypeScript modules, you may face various pitfalls. A general discussion about TypeScript pitfalls will be handled in the [Apollo Universal Starter Kit issues section]. The recipes from discussion will be added into the [Recipes for Common TypeScript Pitfalls](#common-typescript-pitfalls) section.

### Common TypeScript Pitfalls

* TypeScript has limited support for the code using custom extensions. 

Because of the problem above, all the files with code written for the web platform should have extension `somefile.ts`, not `somefile.web.ts`, to let the TypeScript compiler find the file. And if the same file has different implementation for mobile platforms, it should have extension `somefile.native.ts`. In 
JavaScript code when you import `somefile` you never include per-platform extension, i.e. you never import 
`somefile.native`, because extension is determined at compile time automatically for you. With TypeScript the situation is different, `somefile` and `somefile.naitve.ts` might export different interfaces and in this case you will have to import `somefile.native`.
- `locales/index.js` must be kept in JavaScript for now, if you rename it to have `.ts` extension you will run into 
incompatibilities between `@alienfast/i18next-loader` and TypeScript compiler. This can be fixed by making changes to `@alienfast/i18next-loader`.
- When using stateless JSX component written in JavaScript from within TypeScript code you can get error `TS2322` - 
missing key, despite the fact that key in question is declared optional. The known workaround for now is to convert this component to stateful JSX component.
- `tslint` complains that the module is missing, though it is present in `peerDependencies`. `tslint` checks 
`dependencies` and either `peerDependencies` or `devDependencies`, not both, hence we face this problem. We have 
configured `tslint` to look into `dependencies`, `devDependencies` and `optionalDependencies`, this is the best that can be reached at the moment. Hence you can work around this issue by switching from using `peerDependencies` in 
`package.json` to `optionalDependencies`, this way both `eslint` and `tslint` find all needed modules.

## Naming Convention

We recommend that you stick to the following convention when naming the files for different platforms:

```
MyComponent.web.jsx        // for the client-side app
MyComponent.android.jsx    // for the Android app
MyComponent.ios.jsx        // for the iOS app
```

However, you should stick to this convention only if you develop an application for _both_ web and mobile platforms. In case you're going to develop only a client-side app, just omit the `web` part in filenames: Write `MyComponent.jsx` instead of `MyComponent.web.jsx`. Similarly, if you're going to develop only a mobile application, you can omit the `.android` or `.ios` parts and just name your components as `MyComponent.jsx`.

[eslint]: https://eslint.org/
[tslint]: https://palantir.github.io/tslint/
[apollo universal starter kit issues section]: https://github.com/sysgears/apollo-universal-starter-kit/issues/785