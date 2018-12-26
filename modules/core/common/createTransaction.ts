import { Transaction } from 'knex';

export default async () => {
  const { knex } = require('@module/database-server-ts');
  const trx = (await new Promise(resolve => knex.transaction(resolve))) as Transaction;

  class Trx {
    public operations: Array<() => any>;

    constructor() {
      this.operations = [];
    }

    public addOperation(operation: () => any): object {
      this.operations.push(operation);
      return this;
    }

    public async run() {
      try {
        const result = await this.operations.reduce(
          async (prevResultPromise: Promise<object>, operation: (trx: object, prevResult: any) => any) => {
            const prevResult = await prevResultPromise;
            return operation(trx, prevResult);
          },
          new Promise(resolve => resolve())
        );
        trx.commit();
        return result;
      } catch (e) {
        trx.rollback();
      }
    }
  }

  return new Trx();
};
