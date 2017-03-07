import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {mockServer} from "graphql-tools";
import schema from "../../../src/server/api/schema_def.graphqls";
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
        addCount: {
            amount: increasedValue
        }
    })
});

describe('Add count mutation', () => {
    it('should return a new value of a counter after a mutation', () => {
        return mockedServer
            .query(ADD_COUNT_MUTATION, {"amount": increasedValue})
            .then(value => value.data.addCount.amount)
            .should.eventually.equal(increasedValue)
    });
    it('should not update a nonexistent value', () => {
        return mockedServer
            .query(ADD_COUNT_MUTATION, {"nonexistent": increasedValue})
            .then(value => value.errors)
            .should.eventually.have.lengthOf(1)
    });
});
