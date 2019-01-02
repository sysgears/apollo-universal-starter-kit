import knex from '.';

export default async () => {
  const trx = await new Promise(resolve => knex.transaction(resolve));

  class Trx {
    constructor() {
      this.operations = [];
    }

    addOperation(operation) {
      this.operations.push(operation);
      return this;
    }

    async run() {
      try {
        const result = await this.operations.reduce(async (prevResultPromise, operation) => {
          const prevResult = await prevResultPromise;
          return operation(trx, prevResult);
        }, new Promise(resolve => resolve()));
        trx.commit();
        return result;
      } catch (e) {
        trx.rollback();
      }
    }
  }

  return new Trx();
};
