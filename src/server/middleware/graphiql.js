import { graphiqlExpress } from 'graphql-server-express'

export default graphiqlExpress({
  endpointURL: '/graphql',
  query:
   '{\n' +
   '  count {\n' +
   '    amount\n' +
   '  }\n' +
   '}'
});