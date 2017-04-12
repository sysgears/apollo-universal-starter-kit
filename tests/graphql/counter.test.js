import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { mockServer } from "graphql-tools";

import AMOUNT_QUERY from '!raw-loader!../../src/ui/counter/graphql/count_get.graphql';
import ADD_COUNT_MUTATION from "!raw-loader!../../src/ui/counter/graphql/count_add_mutation.graphql";
import schema from "../../src/server/api/graphqls/schema_def.graphqls";

chai.use(chaiAsPromised);
chai.should();

const counterValue = 10;
const increasedValue = 11;

const mockedServer = mockServer(schema, {
    Count: () => ({
        amount: counterValue
    }),
    Mutation: () => ({
        addCount: (obj, {amount}) => ({
            amount: amount
        })
    })
});

describe('Counter', () => {
    it('should get the current value of a counter', () => {
        return mockedServer
            .query(AMOUNT_QUERY)
            .then(value => value.data.count.amount)
            .should.eventually.equal(counterValue);
    });
    it('should return a new value of a counter after a mutation', () => {
        return mockedServer
            .query(ADD_COUNT_MUTATION, {"amount": increasedValue})
            .then(value => value.data.addCount.amount)
            .should.eventually.equal(increasedValue);
    });
});
