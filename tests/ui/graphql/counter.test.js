import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {mockServer} from "graphql-tools";
import schema from "../../../src/server/api/schema_def.graphqls";
import AMOUNT_QUERY from '!raw!../../../src/ui/graphql/CountGet.graphql'
import ADD_COUNT_MUTATION from "!raw!../../../src/ui/graphql/CountAddMutation.graphql";

chai.use(chaiAsPromised);

const should = chai.should();

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
            .should.eventually.equal(counterValue)
    });
    it('should return a new value of a counter after a mutation', () => {
        return mockedServer
            .query(ADD_COUNT_MUTATION, {"amount": increasedValue})
            .then(value => value.data.addCount.amount)
            .should.eventually.equal(increasedValue)
    });
});
