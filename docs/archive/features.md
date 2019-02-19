# Features


- Overview
   - Purpose 
   - Client Feature vs Server Feature classes   
- Server Feature
   - Arguments
     - schema
     - createResolversFunc
         - When is it invoked? 
             - What should it return?
             - Using pubsub 
                 - explain the pubsub argument
         - createContextFunc
             - when is it invoked?
             - what should it return?
         - middleware
       - Hierarchical composition
           - explain `new Feature(counter, post, user, graphqlTypes);` in modules/index.js`
- Client Feature
   - Arguments
      - navItem
      - tabItems
      - route
      - reducer
      - features
   - Hierarchical composition
- Tutorial:
    - add a server feature
         - add a model using a migration
         - add graphql schema
         - add resolvers
    - add a client feature that uses the server feature


---

Feature-modules is an attempt to have Interface-like concept in JavaScript.
We connect all the modules in client/modules to the other parts of kits code 
using one Interface declared in connector.js. 
Each such module must implement this Interface. 
When we have Interface we know how to write new module-feature implementing that Interface 
and how to use all feature-modules that implement that Interface in the rest of the kit


---


- Features are different in the client and server. You could theoretically have multiple types of features on either end. They can be fractal, that is, a feature can have sub features.
- Features are basically a predefined set of options that get recursively merged. Different params on the frontend and backend. You can change theses.
- Feature code is found at the root of the client/server module directories
  - Definitions are in `connector.js` in the server, `connector.web.jsx` in the client
  - Feature inclusion is in the `index.js`
  - Actual features import the `connector.js` file and add the params they want
- Common code uses Feature params to do things such as, create the context for the resolvers or build menus in the client.

In the `auth-upgrades` branch (https://github.com/sysgears/apollo-universal-starter-kit/tree/auth-upgrades)...

There are some examples of:
 - conditional features based on settings (see the `{client,server}/modules/index.js` files)
 - fractal features (see the `{client,server}/modules/entities` dirs)
