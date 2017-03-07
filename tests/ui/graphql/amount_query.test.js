import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {mockServer} from "graphql-tools";
import schema from "../../../src/server/api/schema_def.graphqls";
import AMOUNT_QUERY from '!raw!../../../src/ui/graphql/CountGet.graphql'

chai.use(chaiAsPromised);

const should = chai.should();

const counterValue = 10;

const mockedServer = mockServer(schema, {
    Count: () => ({
        amount: counterValue
    })
});

describe('Count Get', () => {
    it('should get the current value of a counter', () => {
        return mockedServer
            .query(AMOUNT_QUERY)
            .then(value => value.data.count.amount)
            .should.eventually.equal(counterValue)
    });
    it('should not get a nonexistent value', () => {
        const queryForNonexistentField = `
        query getCount {
            count {
                nonexistentField
            }
        }`;
        return mockedServer
            .query(queryForNonexistentField)
            .then(value => value.errors)
            .should.eventually.have.lengthOf(1)
    });
});
