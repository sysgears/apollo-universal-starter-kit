export default () => ({
  Query: {
    fields: {
      cruds: {
        orderBy: { id: 'desc' }
      },
      crud: {
        where: (table, { id }) => `${table}.id = ${id}`
      }
    }
  },
  Crud: {
    sqlTable: 'crud',
    uniqueKey: 'id',
    fields: {
      id: { sqlColumn: 'id' },
      name: { sqlColumn: 'name' }
    }
  }
});
