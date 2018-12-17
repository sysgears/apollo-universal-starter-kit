# Getting started with Scala Starter Kit

In this section, you will install the Universal Starter Kit and run the Scala implementation of it.

The following steps are needed:

1. Install SBT 1.2.6 or higher.
2. Clone the stable branch of Apollo Universal Starter Kit.
   
   ```bash
   git clone -b stable https://github.com/sysgears/apollo-universal-starter-kit.git
   cd apollo-universal-starter-kit
   ```
3. Set current directory to **packages/server-scala**: 

    ```bash
    cd packages/server-scala
    ```
4. Run the starter kit:

     ```bash
     sbt run
     ```

After running, the GraphiQL (graphical interactive in-browser GraphQL IDE) should become available at [http://localhost:8080/graphiql].

[http://localhost:8080/graphiql]: http://localhost:8080/graphiql