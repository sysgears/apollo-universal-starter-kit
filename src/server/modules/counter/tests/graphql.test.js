import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { graphql, print } from "graphql";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";

import AMOUNT_QUERY from 'client/modules/counter/graphql/count_get.graphql';
import ADD_COUNT_MUTATION from "client/modules/counter/graphql/count_add_mutation.graphql";
import rootSchema from "server/api/root_schema.graphqls";
import counterSchema from "../schema.graphqls";

chai.use(chaiAsPromised);
chai.should();

const counterValue = 10;
const increasedValue = 11;

const mocks = {
  Count: () => ({
    amount: counterValue
  }),
  Mutation: () => ({
    addCount: (obj, { amount }) => ({
      amount: amount
    })
  })
};

const schema = makeExecutableSchema({ typeDefs: [rootSchema, counterSchema] });

addMockFunctionsToSchema({schema, mocks});

describe('Counter', () => {
  it('should get the current value of a counter', () => {
    return graphql(schema, print(AMOUNT_QUERY))
      .then(value => value.data.count.amount)
      .should.eventually.equal(counterValue);
  });
  it('should return a new value of a counter after a mutation', () => {
    return graphql(schema, print(ADD_COUNT_MUTATION), null, null, { "amount": increasedValue })
      .then(value => value.data.addCount.amount)
      .should.eventually.equal(increasedValue);
  });
});
