# Introduction

This section will introduce you to the basic concepts required in order to understand this repository's structure and how to use it. It the long run it will help you both contribute to this repository and use it for your own projects. 

In this part we will cover only basic concepts but not implementation details we actually use in this repository. We will leave that for another section.

# Fractal structure of the repository

Apollo Universal Starter Kit has a fractal structure. On the high level this means that code is organized by features rather than type of code. This makes it easier to separate concerns among different features that can, but do not necessarily, interact.

But let us get into some more details to understand this better. Apollo Universal Starter Kit uses `fractal-objects` library which you can find [on this link](https://github.com/sysgears/fractal-objects). In the README there you can find the following example there:

```
// Fractal object #1
const part1 = { arrayKey: [1], objectKey: { a: 'a', b: 'b' } };
// Fractal object #2
const part2 = { arrayKey: [2, 3], objectKey: { c: 'c' } };
// Fractal object #3
const part3 = { arrayKey: [4] }

// View the result of the multiplication of the fractal objects #1, #2, and #3
console.log(fold([part1, part2, part3]));
// The output is a new fractal object:
// { arrayKey: [ 1, 2, 3, 4 ], objectKey: { a: 'a', b: 'b', c: 'c' } }
```

So fractal objects are nothing unheard of, they are regular objects which have common keys. Fractal operator `fold` is a way of combining these objects. We just mash together parts of different objects by keys. So in the example we merge all arrays under the key 'arrayKey'. We do this recursively for the objects down the hierarchy as well. Since this is self-similar process, this is where fractality name comes from.

And that's it, simple as that. And although the idea is simple, we can leverage it in many ways to make our code more modular and extendable.

Let us see how the fractal structure is used in the Apollo Universal Starter Kit repository to manage modules and features. Of course the description below will be just high level overview to get the general idea. Later on we will go into exact details. 

Since we are building an app, there are multiple aspects that we want to consider. For most of the cases we will need:
- web server
- a web app
- a mobile app

Note that we are using monorepo, meaning all the relevant code is in the single repository. This has become usual practice even in the large tech giants. Usually you would break up the app into something like this:

```
|- app
  |- server/
  |- web/
  |- mobile/
```

Where each folder would contain code for varios features. Let us call them `f1`, `f2` and `f3`. We would need to implement these features at each part of the app. So the final structure would like something like:

```
|- app/
  |- server/
    |- f1/
    |- f2/
    |- f3/
  |- web/
    |- f1/
    |- f2/
    |- f3/
  |- mobile/
    |- f1/
    |- f2/
    |- f3/
```

Here is where the fun part comes. We invert this structure by grouping along **features** rather than types of the code. So the Apollo Universal Starter Kit structure looks something like:

```
|- app/
  |- f1/
    |- server/
    |- web/
    |- mobile/
  |- f2/
    |- server/
    |- web/
    |- mobile/
  |- f3/
    |- server/
    |- web/
    |- mobile/
```

Now how does this related to the fractal structure? For the simplicity let us focus on the `server` features for now. Suppose we have a class `ServerModule` which has various keys useful for server implementation of our feature. For example we might have `schema` to define our entities, `middlewares` to preprocess the incoming requests and `resolvers` to resolve GraphQL requests we are receiving. So our object would look something like:

```
ServerModule {
  schema,
  middlewares,
  resolvers
}
```

(Note that this is not the exact implementation we are using, we will get into more details later on)

Each feature will have its own implementation of this `ServerModule`. So structure would look something like:

```
|- app/
  |- f1/
    |- server/
      |- ServerModule
    |- web/
    |- mobile/
  |- f2/
    |- server/
      |- ServerModule
    |- web/
    |- mobile/
  |- f3/
    |- server/
      |- ServerModule
    |- web/
    |- mobile/
```

The magic is to call fractal operator `fold` on the entire app. If we define well how to mash together `ServerModules` then in the end we will have a single object comprised of several features.

So the `App` object would look something like:

```
App {
  server {
    schema: [f1_schema, f2_schema, f3_schema],
    middlewares: [f1_middlewares, f2_middlewares, f3_middlewares],
    resolvers: [f1_resolvers, f2_resolvers, f3_resolvers]
  }
}
```

We see that the `App.server` itself now is a `ServerModule` comprised of couple of smaller `ServerModules`. Hence it has a fractal structure.