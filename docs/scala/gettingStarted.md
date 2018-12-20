# Getting Started with Scala Back-End Application

In this section, you'll install Apollo Universal Starter Kit and run the Scala implementation of the back-end 
application.

The following steps are needed:

1. Install [sbt]. You can use sbt 1.2.6 or higher.

**NOTE**: If you decide to run the React or Angular application for the Scala back end, you'll need to [install Node.js] 
and [Yarn] to install and handle the client-side packages.

2. Clone the stable branch of Apollo Universal Starter Kit and go into the project root directory:
   
```bash
git clone -b stable https://github.com/sysgears/apollo-universal-starter-kit.git
cd apollo-universal-starter-kit
```

3. Go into the `packages/server-scala` directory, which contains the Scala global module: 

```bash
cd packages/server-scala
```

4. Run the Scala application:

```bash
sbt run
```

This command will build Scala back-end application and seed the demo data to SQLite (a default database).

You can also use the command `sbt ~reStart` to run the project if you need live code reload.

Once the Scala application is built and running, you can try out GraphiQL, a graphical interactive in-browser GraphQL 
IDE. Follow to [http://localhost:8080/graphiql] to test the Scala back end.

5. Run the client-side application (optional).

The Scala application is built for the React client-side application in Apollo Universal Starter Kit. From the root of 
Apollo Universal Starter Kit, you can run the React application with the following command:

```bash
yarn && yarn watch-client
```

`yarn` will install all the React dependencies, and `yarn watch-client` will build and run the React application and 
automatically open it in your default browser.

[sbt]: https://www.scala-sbt.org/download.html
[http://localhost:8080/graphiql]: http://localhost:8080/graphiql
[install node.js]: https://nodejs.org/en/ 
[yarn]: https://yarnpkg.com/lang/en/docs/install/#debian-stable