import { graphiqlExpress } from 'apollo-server'

export default graphiqlExpress({
  endpointURL: '/graphql',
  query:
   '{\n' +
   '  count {\n' +
   '    amount\n' +
   '  }\n' +
   '}'
});